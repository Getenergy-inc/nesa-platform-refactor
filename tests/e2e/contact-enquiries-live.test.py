"""Real Contact UI + Data API access checks; no privileged SQL in the rule test.

Run: python3 tests/e2e/contact-enquiries-live.test.py
Optional member/admin sessions use CONTACT_MEMBER_SESSION_FILE and
CONTACT_ADMIN_SESSION_FILE in lovable auth-session format. Never promote a fixture.
The output reference allows authorised cleanup after the test.
"""
import json
import os
import unittest
import uuid
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


class ContactEnquiryLiveTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(headless=True)
        cls.context = cls.browser.new_context(viewport={"width": 1280, "height": 1800}, reduced_motion="reduce")
        cls.page = cls.context.new_page()
        cls.base = os.environ.get("CONTACT_BASE_URL", "http://localhost:8080")
        cls.page.goto(cls.base, wait_until="domcontentloaded")
        config = cls.page.evaluate("""async () => {
            const config = await import('/src/integrations/supabase/client.ts');
            return {url: config.supabase.supabaseUrl, key: config.supabase.supabaseKey};
        }""")
        cls.api_url = config["url"] + "/rest/v1/contact_enquiries"
        cls.public_key = config["key"]
        cls.marker = "AUTOMATED CONTACT TEST - " + uuid.uuid4().hex
        cls.reference = None

    @classmethod
    def tearDownClass(cls):
        cls.context.close()
        cls.browser.close()
        cls.pw.stop()

    def api(self, method, token=None, body=None, query=None):
        headers = {"apikey": self.public_key, "Authorization": "Bearer " + (token or self.public_key),
                   "Prefer": "return=representation" if method == "PATCH" else "return=minimal"}
        return self.context.request.fetch(self.api_url, method=method, headers=headers, data=body, params=query)

    def rows(self, token=None):
        response = self.api("GET", token, query={"reference": "eq." + self.reference, "select": "*"})
        self.assertEqual(response.status, 200, "Read must be evaluated through the real Data API")
        return response.json()

    def assert_restricted(self, token=None):
        self.assertEqual(self.rows(token), [], "Private contact enquiry leaked")
        response = self.api("PATCH", token, {"status": "closed"}, {"reference": "eq." + self.reference})
        self.assertEqual(response.status, 200)
        self.assertEqual(response.json(), [], "Unauthorised status update succeeded")

    def test_01_anonymous_ui_saves_enquiry_and_cannot_read_or_update(self):
        page = self.page
        page.goto(self.base + "/contact?subject=merchandise", wait_until="domcontentloaded")
        self.assertEqual(page.get_by_label("Enquiry type *", exact=True).input_value(), "Merchandise")
        page.get_by_label("Full name *", exact=True).fill(self.marker)
        page.get_by_label("Email address *", exact=True).fill("contact-test@example.invalid")
        page.get_by_label("Country *", exact=True).fill("Nigeria")
        page.get_by_label("Subject *", exact=True).fill(self.marker)
        page.get_by_label("Message *", exact=True).fill("Synthetic access-rule test only; no merchandise order or payment is requested.")
        page.get_by_label("I consent to NESA-Africa recording and reviewing this enquiry and using the supplied contact details to respond. I have not included sensitive documents, payment credentials or children's personal data. *", exact=True).check()
        with page.expect_response(lambda response: "/rest/v1/contact_enquiries" in response.url and response.request.method == "POST") as saved:
            page.get_by_role("button", name="Submit enquiry", exact=True).click()
        self.assertEqual(saved.value.status, 201, "Real anonymous contact insert failed")
        self.assertEqual(saved.value.request.headers.get("authorization"), "Bearer " + self.public_key)
        self.assertEqual(saved.value.request.post_data_json["enquiry_type"], "Merchandise")
        self.__class__.reference = saved.value.request.post_data_json["reference"]
        page.get_by_role("heading", name="Enquiry recorded", exact=True).wait_for()
        self.assert_restricted()
        output = Path(os.environ.get("CONTACT_RESULT_FILE", "/tmp/browser/contact-enquiries-live/result.json"))
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps({"reference": self.reference, "marker": self.marker, "note": "Synthetic enquiry; no order or payment"}))
        page.screenshot(path=str(output.parent / "contact-saved.png"))

    def test_02_regular_member_cannot_read_or_update(self):
        self.assertIsNotNone(self.reference)
        session = load_session("CONTACT_MEMBER_SESSION_FILE")
        if not session:
            self.skipTest("Authorised regular-member session file not supplied")
        self.assert_restricted(session["access_token"])

    def test_03_admin_reads_and_updates_status(self):
        self.assertIsNotNone(self.reference)
        session = load_session("CONTACT_ADMIN_SESSION_FILE")
        if not session:
            self.skipTest("Authorised administrator session file not supplied; admin checks NOT verified")
        token = session["access_token"]
        rows = self.rows(token)
        self.assertEqual(len(rows), 1, "Admin must read the actual anonymous UI insert")
        self.assertEqual(rows[0]["status"], "new")
        response = self.api("PATCH", token, {"status": "in_progress"}, {"reference": "eq." + self.reference})
        self.assertEqual(response.status, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(self.rows(token)[0]["status"], "in_progress")


if __name__ == "__main__":
    unittest.main(verbosity=2)
