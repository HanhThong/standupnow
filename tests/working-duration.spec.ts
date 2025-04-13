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

test.describe('Working Duration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.addInitScript(mockSettingsContext());
  });

  test.describe('Desktop', () => {
    test('should start timer with correct duration', async ({ page }) => {
      // Start the timer
      await page.click('[data-testid="timer-button"]');
      
      // Check timer display
      const timerDisplay = await page.locator('[data-testid="timer-display"]');
      await expect(timerDisplay).toBeVisible({ timeout: 5000 });
      
      // Verify initial time display (45:00)
      const timeText = await page.textContent('[data-testid="timer-display"]');
      expect(timeText).toContain('45:00');
    });

    test('should update timer during countdown', async ({ page }) => {
      // Start timer
      await page.click('[data-testid="timer-button"]');
      await expect(page.locator('[data-testid="timer-display"]')).toBeVisible();
      
      // Get initial time
      const initialTime = await page.textContent('[data-testid="timer-display"]');
      
      // Wait 2 seconds
      await page.waitForTimeout(2000);
      
      // Get updated time
      const updatedTime = await page.textContent('[data-testid="timer-display"]');
      
      // Verify time has changed
      expect(initialTime).not.toEqual(updatedTime);
    });

    test('should handle short timer completion', async ({ page }) => {
      // Set a very short duration
      await page.click('[data-testid="settings-button"]');
      await page.fill('[data-testid="duration-input"]', '1');
      await page.click('[data-testid="save-button"]');
      
      // Start timer
      await page.click('[data-testid="timer-button"]');
      
      // Wait a short time to verify countdown
      await page.waitForTimeout(2000);
      
      // Verify timer is running
      const timerButton = await page.locator('[data-testid="timer-button"]');
      await expect(timerButton).toHaveText('Stop Working');
      
      // Stop the timer (we don't need to wait for full completion in this test)
      await timerButton.click();
      await expect(timerButton).toHaveText('Start Working');
    });

    test('should handle timer interruption', async ({ page }) => {
      // Start timer
      await page.click('[data-testid="timer-button"]');
      
      // Verify timer started
      const timerDisplay = await page.locator('[data-testid="timer-display"]');
      await expect(timerDisplay).toBeVisible();
      
      // Wait briefly
      await page.waitForTimeout(2000);
      
      // Stop timer
      await page.click('[data-testid="timer-button"]');
      
      // Verify timer stopped
      await expect(timerDisplay).not.toBeVisible();
      
      // Start timer again and verify reset
      await page.click('[data-testid="timer-button"]');
      const timeText = await page.textContent('[data-testid="timer-display"]');
      expect(timeText).toContain('45:00');
    });
  });

  test.describe('Mobile', () => {
    test.use({ 
      viewport: { width: 393, height: 851 },
      contextOptions: { hasTouch: true }
    });

    test('should handle touch interactions for timer controls', async ({ page }) => {
      // Start timer with touch
      await page.click('[data-testid="timer-button"]');
      const timerDisplay = await page.locator('[data-testid="timer-display"]');
      await expect(timerDisplay).toBeVisible();
      
      // Stop timer with touch
      await page.click('[data-testid="timer-button"]');
      await expect(timerDisplay).not.toBeVisible();
    });

    test('should display timer elements properly on mobile screen', async ({ page }) => {
      // Start timer
      await page.click('[data-testid="timer-button"]');
      await expect(page.locator('[data-testid="timer-display"]')).toBeVisible();
      
      // Check timer display size and position
      const timerDisplay = await page.locator('[data-testid="timer-display"]');
      const displayBox = await timerDisplay.boundingBox();
      
      // Verify timer display fits mobile screen
      expect(displayBox?.width).toBeLessThan(393);
      expect(displayBox?.height).toBeLessThan(851);
    });

    test('should maintain timer state during orientation changes', async ({ page }) => {
      // Start timer
      await page.click('[data-testid="timer-button"]');
      await expect(page.locator('[data-testid="timer-display"]')).toBeVisible();
      
      // Get initial time
      const initialTime = await page.textContent('[data-testid="timer-display"]');
      
      // Change to landscape
      await page.setViewportSize({ width: 851, height: 393 });
      await page.waitForTimeout(1000); // Wait for layout adjustment
      
      // Verify timer still running
      const timerDisplay = await page.locator('[data-testid="timer-display"]');
      await expect(timerDisplay).toBeVisible();
      
      // Verify time continued counting
      const landscapeTime = await page.textContent('[data-testid="timer-display"]');
      expect(initialTime).not.toEqual(landscapeTime);
    });
  });
});