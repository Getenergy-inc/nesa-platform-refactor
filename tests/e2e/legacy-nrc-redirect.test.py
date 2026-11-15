"""Regression coverage for legacy NRRC links using the running preview."""
import unittest
from playwright.sync_api import sync_playwright


class LegacyNrcRedirectTest(unittest.TestCase):
    def test_legacy_links_preserve_path_query_and_fragment(self):
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            for suffix in ("", "/sign-in", "/dashboard", "/my-queue", "/cases/example", "/member/example", "/profile"):
                with self.subTest(suffix=suffix):
                    page = browser.new_page(viewport={"width": 1280, "height": 1800})
                    # Observe the first redirect before sign-in/access guards run.
                    page.goto("http://localhost:8080", wait_until="domcontentloaded")
                    page.evaluate("""() => {
                        window.legacyRedirects = [];
                        const replace = history.replaceState.bind(history);
                        history.replaceState = (state, title, url) => {
                            window.legacyRedirects.push(String(url));
                            return replace(state, title, url);
                        };
                    }""")
                    page.evaluate("""path => {
                        history.pushState({}, '', path);
                        window.dispatchEvent(new PopStateEvent('popstate'));
                    }""", f"/nrc{suffix}?source=legacy#workspace")
                    expected = f"/nrrc{suffix}?source=legacy#workspace"
                    page.wait_for_function("expected => window.legacyRedirects.includes(expected)", arg=expected)
                    self.assertIn(expected, page.evaluate("window.legacyRedirects"))
                    page.close()
            browser.close()


if __name__ == "__main__":
    unittest.main()