import { test, expect } from "@playwright/test";

test.describe("Portfolio", () => {
  test("main page loads with all sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#hero")).toBeVisible();
    await expect(page.locator("#about")).toBeVisible();
    await expect(page.locator("#projects")).toBeVisible();
    await expect(page.locator("#contact")).toBeVisible();
  });

  test("nav links scroll to sections", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/#about"]');
    await expect(page.locator("#about")).toBeInViewport();
  });

  test("project detail page loads", async ({ page }) => {
    await page.goto("/projects/indoor-climate");
    await expect(page.locator("main h1").first()).toContainText("Indoor Climate");
    await expect(
      page.getByRole("link", { name: "Back to projects" }),
    ).toBeVisible();
  });

  test("404 page renders", async ({ page }) => {
    await page.goto("/nonexistent");
    await expect(page.locator("main h1").first()).toContainText("404");
  });

  test("responsive: mobile nav toggle works", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.click('label[for="menu-toggle"]');
    await expect(page.locator("#menu-toggle")).toBeChecked();
  });
});
