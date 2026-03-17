import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should display login page", async ({ page }) => {
    await page.goto("/login");

    // Check page title and branding
    await expect(page.getByText("Tso Finance")).toBeVisible();
    await expect(
      page.getByText("Your money. Your clarity. Your command.")
    ).toBeVisible();

    // Check form elements
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.goto("/login");

    // Fill in invalid credentials
    await page.getByLabel("Email Address").fill("invalid@example.com");
    await page.getByLabel("Password").fill("wrongpassword");

    // Submit form
    await page.getByRole("button", { name: /sign in/i }).click();

    // Check for error message
    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test("should redirect to login when accessing protected route", async ({
    page,
  }) => {
    await page.goto("/");

    // Should redirect to login
    await expect(page).toHaveURL(/.*login.*/);
  });
});
