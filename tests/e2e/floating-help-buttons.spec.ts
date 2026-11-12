import { test, expect } from "@playwright/test";

const ROUTES = ["/", "/eduaid-africa"] as const;
const WIDTHS = [320, 390] as const;
const MINIMUM_GAP = 8;
const MINIMUM_TARGET_SIZE = 48;

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    test.describe(`floating help buttons on ${route} at ${width}px`, () => {
      test.use({ viewport: { width, height: 844 } });

      test("stay separate, tappable, and above mobile quick actions", async ({ page }) => {
        await page.goto(route);
        await page.waitForLoadState("domcontentloaded");

        const faqButton = page.getByRole("button", { name: "Open FAQ helper" });
        const chatButton = page.getByRole("button", {
          name: "Chat with Sophia — Official NESA-Africa Support Assistant",
        });
        const quickActions = page.getByRole("navigation", { name: "Mobile quick actions" });

        await expect(faqButton).toBeVisible();
        await expect(chatButton).toBeVisible();
        await expect(quickActions).toBeVisible();
        await expect
          .poll(async () => (await faqButton.boundingBox())?.width ?? 0)
          .toBeGreaterThanOrEqual(MINIMUM_TARGET_SIZE);
        await expect
          .poll(async () => (await chatButton.boundingBox())?.width ?? 0)
          .toBeGreaterThanOrEqual(MINIMUM_TARGET_SIZE);

        const faqBox = await faqButton.boundingBox();
        const chatBox = await chatButton.boundingBox();
        const quickActionsBox = await quickActions.boundingBox();

        expect(faqBox).not.toBeNull();
        expect(chatBox).not.toBeNull();
        expect(quickActionsBox).not.toBeNull();

        expect(faqBox!.width).toBeGreaterThanOrEqual(MINIMUM_TARGET_SIZE);
        expect(faqBox!.height).toBeGreaterThanOrEqual(MINIMUM_TARGET_SIZE);
        expect(chatBox!.width).toBeGreaterThanOrEqual(MINIMUM_TARGET_SIZE);
        expect(chatBox!.height).toBeGreaterThanOrEqual(MINIMUM_TARGET_SIZE);

        expect(
          chatBox!.y - (faqBox!.y + faqBox!.height),
          "FAQ and chat buttons must have a clear vertical gap",
        ).toBeGreaterThanOrEqual(MINIMUM_GAP);
        expect(
          quickActionsBox!.y - (chatBox!.y + chatBox!.height),
          "Chat button must remain above the mobile quick actions",
        ).toBeGreaterThanOrEqual(MINIMUM_GAP);

        await faqButton.click();
        const faqDialog = page.getByRole("dialog");
        await expect(faqDialog).toBeVisible();
        await faqDialog.getByRole("button", { name: "Close" }).click();
        await expect(faqDialog).toBeHidden();

        await chatButton.click();
        const chatHeading = page.getByRole("heading", { name: "Sophia", exact: true });
        await expect(chatHeading).toBeVisible();
        await page.getByRole("button", { name: "Close support chat" }).click();
        await expect(chatHeading).toBeHidden();
        await expect(chatButton).toBeVisible();
      });
    });
  }
}
