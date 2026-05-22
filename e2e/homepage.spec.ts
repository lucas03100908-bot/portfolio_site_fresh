import { expect, test, type Page } from "@playwright/test";

function buttonByText(page: Page, label: string) {
  return page.locator("button").filter({ hasText: new RegExp(label, "i") }).first();
}

async function openDesktopCategoryPanel(
  page: Page,
  categoryName: string,
  projectTitle: string
) {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(buttonByText(page, "Kim Minho")).toBeVisible();
  await expect(page.getByText("Digital Media Designer")).toBeVisible();

  await page.evaluate(() => {
    window.scrollTo(0, window.innerHeight + 32);
  });
  await page.waitForTimeout(1000);

  const categoryButton = buttonByText(page, categoryName);

  await expect(categoryButton).toBeVisible();
  await categoryButton.click({ force: true });

  await expect(page.getByText("Selected Category")).toBeVisible();
  await expect(page.locator('section[aria-busy] button').filter({ hasText: /^Close$/ }).first()).toBeVisible();
  await expect(buttonByText(page, projectTitle)).toBeVisible();
}

test.describe("homepage desktop browser interactions", () => {
  test("opens the desktop category panel in a real browser", async ({ page }) => {
    await openDesktopCategoryPanel(
      page,
      "UX/UI",
      "Campus Utility App"
    );

    await expect(buttonByText(page, "Campus Utility App")).toBeVisible();
  });

  test("keeps the background stage lightweight while hovering project cards", async ({ page }) => {
    await openDesktopCategoryPanel(
      page,
      "UX/UI",
      "Campus Utility App"
    );

    const firstCard = buttonByText(page, "Campus Utility App");
    const hoverOverlay = firstCard.locator(':scope > div').first();
    const overlayOpacityBeforeHover = await hoverOverlay.evaluate(
      (element) => window.getComputedStyle(element).opacity
    );
    const firstCardBox = await firstCard.boundingBox();

    if (!firstCardBox) {
      throw new Error("Expected first project card to have a bounding box");
    }

    await expect(page.getByTestId("background-media-layer")).toHaveCount(0);
    await expect(page.getByTestId("idle-background-video")).toHaveCount(0);

    await page.mouse.move(
      firstCardBox.x + firstCardBox.width / 2,
      firstCardBox.y + firstCardBox.height / 2
    );

    await expect
      .poll(
        () => hoverOverlay.evaluate((element) => window.getComputedStyle(element).opacity),
        { message: "project card overlay should respond to hover in the real browser" }
      )
      .not.toBe(overlayOpacityBeforeHover);

    await expect(page.getByTestId("background-media-layer")).toHaveCount(0);
    await expect(page.getByText("Selected Category")).toBeVisible();
  });
});