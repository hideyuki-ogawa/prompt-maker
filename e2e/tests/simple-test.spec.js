import { test, expect } from '@playwright/test';

test.describe('簡単な動作確認', () => {
  test('基本的な要素の確認', async ({ page }) => {
    await page.goto('/');
    
    // タイトルの確認
    await expect(page.locator('h1')).toContainText('はんなりプロンプトキッチン');
    
    // 初期状態でメールタブがアクティブ
    await expect(page.locator('[data-tab="email"]')).toHaveClass(/active/);
    await expect(page.locator('#emailFormContainer')).toHaveClass(/active/);
    
    // メールフォームが表示されている
    await expect(page.locator('#emailFormContainer')).toBeVisible();
    
    // チェックボックスのラベルが表示されている（カスタムチェックボックス）
    const checkboxLabel = page.locator('label:has(input[name="email_purpose"][value="お礼"])');
    await expect(checkboxLabel).toBeVisible();
    
    // チェックボックスをクリック
    await checkboxLabel.click();
    
    // チェックボックスが選択されたことを確認
    const checkbox = page.locator('input[name="email_purpose"][value="お礼"]');
    await expect(checkbox).toBeChecked();
  });
});