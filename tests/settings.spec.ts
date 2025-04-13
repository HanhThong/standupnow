import { test, expect } from '@playwright/test';

const mockSettings = {
  timerDuration: 45,
};

// Mock the settings context
const mockSettingsContext = () => {
  return `
    window.mockSettings = ${JSON.stringify(mockSettings)};
    const originalUseSettings = window.useSettings;
    window.useSettings = () => ({
      settings: window.mockSettings,
      isLoading: false,
      updateSettings: async (newSettings) => {
        window.mockSettings = { ...newSettings };
      }
    });
  `;
};

test.describe('Settings Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.addInitScript(mockSettingsContext());
  });

  test.describe('Desktop', () => {
    test('should open settings modal with correct default value', async ({ page }) => {
      await page.click('[data-testid="settings-button"]');
      const durationInput = await page.locator('[data-testid="duration-input"]');
      await expect(durationInput).toBeVisible({ timeout: 10000 });
      await expect(durationInput).toHaveValue('45');
    });

    test('should update timer duration and close modal', async ({ page }) => {
      await page.click('[data-testid="settings-button"]');
      await page.fill('[data-testid="duration-input"]', '30');
      await page.click('[data-testid="save-button"]');
      
      // Wait briefly for modal to close
      await page.waitForTimeout(1000);
      
      // Verify settings were updated
      await page.click('[data-testid="settings-button"]');
      const durationInput = await page.locator('[data-testid="duration-input"]');
      await expect(durationInput).toHaveValue('30');
    });

    test('should show error for invalid input', async ({ page }) => {
      await page.click('[data-testid="settings-button"]');
      
      // Test invalid value
      await page.fill('[data-testid="duration-input"]', '-5');
      await page.click('[data-testid="save-button"]');
      
      // Check if error text is visible
      const errorText = await page.locator('text="Please enter a valid duration between 1 and 120 minutes"');
      await expect(errorText).toBeVisible({ timeout: 5000 });
      
      // Value should not be updated
      await page.reload();
      await page.click('[data-testid="settings-button"]');
      const durationInput = await page.locator('[data-testid="duration-input"]');
      await expect(durationInput).toHaveValue('45');
    });
  });

  test.describe('Mobile', () => {
    test.use({ 
      viewport: { width: 393, height: 851 },
      contextOptions: { hasTouch: true }
    });

    test('should display settings modal properly on mobile', async ({ page }) => {
      await page.click('[data-testid="settings-button"]');
      
      // Wait for animation to complete
      await page.waitForTimeout(1000);
      
      // Check modal positioning and size
      const modalContainer = await page.locator('.css-view-175oi2r >> nth=1');
      const boundingBox = await modalContainer.boundingBox();
      
      expect(boundingBox?.width).toBeGreaterThan(300);
      expect(boundingBox?.height).toBeGreaterThan(200);
    });

    test('should have touch-friendly input controls', async ({ page }) => {
      await page.click('[data-testid="settings-button"]');
      
      // Check input is touch-friendly (at least 32px for mobile)
      const input = await page.locator('[data-testid="duration-input"]');
      const inputBox = await input.boundingBox();
      expect(inputBox?.height).toBeGreaterThanOrEqual(32);
      
      // Check buttons are touch-friendly
      const saveButton = await page.locator('[data-testid="save-button"]');
      const buttonBox = await saveButton.boundingBox();
      expect(buttonBox?.height).toBeGreaterThanOrEqual(32);
    });

    test('should handle touch events correctly', async ({ page }) => {
      await page.click('[data-testid="settings-button"]');
      
      // Test touch interaction
      await page.click('[data-testid="duration-input"]');
      await page.fill('[data-testid="duration-input"]', '35');
      await page.click('[data-testid="save-button"]');
      
      // Wait for modal to close
      await page.waitForTimeout(1000);
      
      // Verify settings were updated
      await page.click('[data-testid="settings-button"]');
      const durationInput = await page.locator('[data-testid="duration-input"]');
      await expect(durationInput).toHaveValue('35');
    });
  });
});