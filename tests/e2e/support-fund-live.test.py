"""Real UI + Data API access checks; no persistence mocks or service-role bypass.

Run: python3 tests/e2e/support-fund-live.test.py
Requires Python Playwright and a running preview (SUPPORT_FUND_BASE_URL, default
localhost:8080). Member/admin sessions are secret JSON files in lovable
auth-session format, supplied by SUPPORT_FUND_MEMBER_SESSION_FILE and
SUPPORT_FUND_ADMIN_SESSION_FILE. Never commit these files or promote an account.
Synthetic submissions are retained for audit; no bank transfer is performed.
"""
import json
import os
import unittest
import uuid
from datetime import datetime, timezone
from pathlib import Path

from playwright.sync_api import sync_playwright


def load_session(variable):
    filename = os.environ.get(variable)
    if not filename:
        return None
    data = json.loads(Path(filename).read_text())
    session = data.get("session", data)
    if not session.get("access_token") or not session.get("user", {}).get("id"):
        raise ValueError(f"{variable} must contain a real authorised user session")
    return session


class SupportFundLiveTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(headless=True)
        cls.context = cls.browser.new_context(viewport={"width": 1280, "height": 1800})
        cls.page = cls.context.new_page()
        cls.base = os.environ.get("SUPPORT_FUND_BASE_URL", "http://localhost:8080")
        cls.page.goto(cls.base, wait_until="domcontentloaded")
        # Read only the public configuration used by the actual Vite application.
        config = cls.page.evaluate("""async () => {
            const config = await import('/src/integrations/supabase/client.ts');
            return {url: config.supabase.supabaseUrl, key: config.supabase.supabaseKey};
        }""")
        cls.api_url = config["url"] + "/rest/v1/"
        cls.public_key = config["key"]
        cls.marker = "AUTOMATED TEST - NO PAYMENT - " + uuid.uuid4().hex
        cls.email = "test-" + uuid.uuid4().hex + "@example.invalid"
        cls.ref = None

    @classmethod
    def tearDownClass(cls):
        cls.context.close()
        cls.browser.close()
        cls.pw.stop()

    def api(self, method, table, token=None, body=None, query=None):
        headers = {"apikey": self.public_key, "Authorization": "Bearer " + (token or self.public_key),
                   "Prefer": "return=representation" if method == "PATCH" else "return=minimal"}
        return self.context.request.fetch(self.api_url + table, method=method,
                                          headers=headers, data=body, params=query)

    def rows(self, table, token=None):
        response = self.api("GET", table, token, query={"ref": "eq." + self.ref, "select": "*"})
        self.assertEqual(response.status, 200, "Read must be evaluated through the real Data API")
        return response.json()

    def assert_restricted(self, token=None):
        for table in ("support_fund_pledges", "support_fund_transfer_reports"):
            with self.subTest(table=table):
                self.assertEqual(self.rows(table, token), [], "Private submissions leaked")
                response = self.api("PATCH", table, token, {"site": "unauthorised-change"},
                                    {"ref": "eq." + self.ref})
                self.assertEqual(response.status, 200)
                self.assertEqual(response.json(), [], "Unauthorised update succeeded")

    def test_01_anonymous_ui_saves_pledge_and_transfer_and_cannot_read_or_update(self):
        page = self.page
        page.goto(self.base + "/support-a-special-needs-school#donate", wait_until="domcontentloaded")
        form = page.locator("#donate form").first
        form.get_by_label("Full name*", exact=True).fill(self.marker)
        form.get_by_label("Email*", exact=True).fill(self.email)
        form.get_by_role("button", name="Other amount", exact=True).click()
        form.get_by_label("Other amount (USD)", exact=True).fill("1")
        form.locator('input[name="ack"]').check()
        with page.expect_response(lambda r: "/rest/v1/support_fund_pledges" in r.url and r.request.method == "POST") as saved:
            form.get_by_role("button", name="Continue to bank transfer", exact=True).click()
        self.assertEqual(saved.value.status, 201, "Real anonymous pledge insert failed")
        request = saved.value.request
        self.assertEqual(request.headers.get("authorization"), "Bearer " + self.public_key,
                         "Submission must use the anonymous key, not an authenticated session")
        pledge = request.post_data_json
        self.__class__.ref = pledge["ref"]
        self.assertRegex(self.ref, r"^EA-DN-\d{6}-[A-Z0-9]{4}$")
        self.assertEqual(pledge["amount"], 1)
        self.assertEqual(pledge["acknowledged"], True)
        page.get_by_role("heading", name="Thank you — your pledge is recorded", exact=True).wait_for()
        transfer = page.locator('#donate form').first
        transfer.get_by_label("Date paid*", exact=True).fill(datetime.now(timezone.utc).strftime("%Y-%m-%d"))
        transfer.get_by_label("Amount sent*", exact=True).fill("1")
        transfer.get_by_label("Name on the sending account*", exact=True).fill(self.marker)
        transfer.get_by_label("Bank transaction ID (optional)", exact=True).fill("AUTOMATED-TEST-NO-PAYMENT")
        with page.expect_response(lambda r: "/rest/v1/support_fund_transfer_reports" in r.url and r.request.method == "POST") as reported:
            transfer.get_by_role("button", name="Report my transfer", exact=True).click()
        self.assertEqual(reported.value.status, 201, "Real anonymous transfer insert failed")
        self.assertEqual(reported.value.request.post_data_json["ref"], self.ref)
        page.get_by_role("status").filter(has_text="Transfer reported · awaiting reconciliation").wait_for()
        self.assert_restricted()
        # Anonymous clients may not insert already-confirmed payments.
        for table, payload in (("support_fund_pledges", pledge),
                               ("support_fund_transfer_reports", reported.value.request.post_data_json)):
            response = self.api("POST", table, body={**payload, "ref": self.ref + "-DENIED", "site": "not-nesa"})
            self.assertIn(response.status, (401, 403), "Anonymous insert bypassed the site restriction")
            self.assertEqual(response.json().get("code"), "42501", "Must fail on database access policy, not unrelated validation")
        output = Path(os.environ.get("SUPPORT_FUND_RESULT_FILE", "/tmp/browser/support-fund-live/result.json"))
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps({"ref": self.ref, "marker": self.marker, "amount": 1,
                                      "note": "Synthetic pledge/report; no money sent"}))
        page.screenshot(path=str(output.parent / "transfer-reported.png"))

    def test_02_regular_member_cannot_read_or_update(self):
        self.assertIsNotNone(self.ref, "Anonymous UI flow must complete first")
        session = load_session("SUPPORT_FUND_MEMBER_SESSION_FILE")
        if not session:
            self.skipTest("Authorised regular-member session file not supplied")
        token = session["access_token"]
        roles = self.api("GET", "user_roles", token, query={"user_id": "eq." + session["user"]["id"], "select": "role"})
        self.assertEqual(roles.status, 200)
        self.assertTrue(roles.json(), "Verify the member fixture has a stored role")
        self.assertNotIn("admin", [r["role"] for r in roles.json()])
        self.assert_restricted(token)

    def test_03_admin_reads_and_updates_both_saved_records(self):
        self.assertIsNotNone(self.ref, "Anonymous UI flow must complete first")
        session = load_session("SUPPORT_FUND_ADMIN_SESSION_FILE")
        if not session:
            self.skipTest("Authorised administrator session file not supplied; admin checks NOT verified")
        token = session["access_token"]
        roles = self.api("GET", "user_roles", token, query={"user_id": "eq." + session["user"]["id"], "select": "role"})
        self.assertEqual(roles.status, 200)
        self.assertIn("admin", [r["role"] for r in roles.json()], "Fixture must be a real stored admin role")
        for table, name_field, status, amount_field in (
            ("support_fund_pledges", "donor_name", "pledge_received", "amount"),
            ("support_fund_transfer_reports", "sender_name", "transfer_reported", "amount_sent"),
        ):
            with self.subTest(table=table):
                rows = self.rows(table, token)
                self.assertEqual(len(rows), 1, "Admin must read the actual anonymous UI insert")
                self.assertEqual(rows[0][name_field], self.marker)
                self.assertEqual(rows[0][amount_field], 1)
                self.assertEqual(rows[0]["currency"], "USD")
                self.assertEqual(rows[0]["status"], status)
                self.assertEqual(rows[0]["site"], "nesa", "A forbidden write changed the record")
                updated_name = self.marker + " - ACCESS CHECKED"
                try:
                    response = self.api("PATCH", table, token, {name_field: updated_name}, {"ref": "eq." + self.ref})
                    self.assertEqual(response.status, 200)
                    self.assertEqual(len(response.json()), 1, "Admin update must affect the test row")
                    self.assertEqual(self.rows(table, token)[0][name_field], updated_name)
                finally:
                    restored = self.api("PATCH", table, token, {name_field: self.marker}, {"ref": "eq." + self.ref})
                    self.assertEqual(restored.status, 200)
                self.assertEqual(self.rows(table, token)[0]["status"], status, "Never mark synthetic payments reconciled")


if __name__ == "__main__":
    unittest.main(verbosity=2)