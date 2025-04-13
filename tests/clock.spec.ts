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

test.describe('Clock Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.addInitScript(mockSettingsContext());
  });

  test('should display the current time initially', async ({ page }) => {
    const clockText = await page.textContent('[data-testid="clock-display"]');
    expect(clockText).toBeTruthy();
    expect(clockText).toMatch(/\d{1,2}:\d{2}:\d{2}/);
  });

  test('should show settings button', async ({ page }) => {
    const settingsButton = await page.locator('[data-testid="settings-button"]');
    await expect(settingsButton).toBeVisible();
  });

  test('should open settings modal when settings button is clicked', async ({ page }) => {
    await page.click('[data-testid="settings-button"]');
    
    const durationInput = await page.locator('[data-testid="duration-input"]');
    await expect(durationInput).toBeVisible();
    await expect(durationInput).toHaveValue('45');
  });

  test('should update timer duration through settings', async ({ page }) => {
    // Open settings modal
    await page.click('[data-testid="settings-button"]');
    
    // Update duration to 30 minutes
    await page.fill('[data-testid="duration-input"]', '30');
    await page.click('[data-testid="save-button"]');
    
    // Start the timer
    await page.click('[data-testid="timer-button"]');
    
    // Check if the timer starts with new duration
    const timerDisplay = await page.textContent('[data-testid="timer-display"]');
    expect(timerDisplay).toMatch(/30:00/);
  });

  test('should start and Stop Working with correct button text', async ({ page }) => {
    // Initial state
    const startButton = await page.locator('[data-testid="timer-button"]');
    await expect(startButton).toHaveText('Start Working');
    
    // Start Working
    await startButton.click();
    await expect(startButton).toHaveText('Stop Working');
    
    // Timer should be visible
    const timerDisplay = await page.locator('[data-testid="timer-display"]');
    await expect(timerDisplay).toBeVisible();
    
    // Stop Working
    await startButton.click();
    await expect(startButton).toHaveText('Start Working');
    
    // Timer should be hidden
    await expect(timerDisplay).not.toBeVisible();
  });

  test('should reset timer when closed', async ({ page }) => {
    // Start Working
    await page.click('[data-testid="timer-button"]');
    
    // Wait for timer to count down a bit
    await page.waitForTimeout(2000);
    
    // Stop Working
    await page.click('[data-testid="timer-button"]');
    
    // Start Working again and verify it starts from the beginning
    await page.click('[data-testid="timer-button"]');
    const timerDisplay = await page.textContent('[data-testid="timer-display"]');
    expect(timerDisplay).toMatch(/45:00/);
  });

  test('should continue updating clock while working timer is running', async ({ page }) => {
    // Get initial time
    const initialTime = await page.textContent('[data-testid="clock-display"]');
    expect(initialTime).toBeTruthy();
    
    // Start timer
    await page.click('[data-testid="timer-button"]');
    
    // Verify timer is visible and running
    const timerDisplay = page.locator('[data-testid="timer-display"]');
    await expect(timerDisplay).toBeVisible();
    
    // Wait and check first update
    await page.waitForTimeout(2000);
    const firstUpdate = await page.textContent('[data-testid="clock-display"]');
    expect(firstUpdate).toBeTruthy();
    expect(firstUpdate).not.toBe(initialTime);
    
    // Wait and check second update to ensure continuous updates
    await page.waitForTimeout(2000);
    const secondUpdate = await page.textContent('[data-testid="clock-display"]');
    expect(secondUpdate).toBeTruthy();
    expect(secondUpdate).not.toBe(firstUpdate);
    
    // Verify timer is still running
    await expect(timerDisplay).toBeVisible();
    const timerText = await page.textContent('[data-testid="timer-display"]');
    expect(timerText).toBeTruthy();
  });

});