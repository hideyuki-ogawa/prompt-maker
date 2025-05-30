import { test, expect, devices } from '@playwright/test';

// モバイルデバイスの設定
test.use({
  ...devices['iPhone 12'],
});

test.describe('モバイル表示テスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('モバイルでのタブ表示とスクロール', async ({ page }) => {
    // タブがモバイルでも表示されることを確認
    await expect(page.locator('.tab-button')).toHaveCount(5);

    // タブがスクロール可能または適切に折り返されることを確認
    const tabContainer = page.locator('.tabs');
    await expect(tabContainer).toBeVisible();

    // 各タブをクリックして動作確認
    await page.click('[data-tab="sns"]');
    await expect(page.locator('#snsFormContainer')).toBeVisible();

    await page.click('[data-tab="blog"]');
    await expect(page.locator('#blogFormContainer')).toBeVisible();
  });

  test('モバイルでのフォーム入力', async ({ page }) => {
    // メールフォームでの入力テスト
    await page.click('[data-tab="email"]');

    // チェックボックスのタップ
    await page.tap('input[name="email_purpose"][value="お礼"]');
    await expect(page.locator('input[name="email_purpose"][value="お礼"]')).toBeChecked();

    // テキスト入力（モバイルキーボード対応）
    await page.tap('#email_to_info');
    await page.fill('#email_to_info', 'モバイルテスト');

    // セレクトボックスの操作
    await page.selectOption('#email_tone', 'カジュアル');
    await expect(page.locator('#email_tone')).toHaveValue('カジュアル');
  });

  test('モバイルでのプロンプト生成とコピー', async ({ page }) => {
    await page.click('[data-tab="sns"]');

    // 最小限の入力
    await page.selectOption('#sns_platform', 'Twitter');
    await page.fill('#sns_purpose', 'モバイルテスト');
    await page.fill('#sns_target_audience', 'テストユーザー');
    await page.fill('#sns_main_message', 'モバイルからの投稿テスト');
    await page.selectOption('#sns_tone', 'カジュアル');

    // 生成ボタンのタップ
    await page.tap('#generateBtn');

    // プロンプトが表示されることを確認
    await expect(page.locator('#promptOutput')).not.toBeEmpty();

    // コピーボタンのタップ
    await page.tap('#copyBtn');

    // トーストメッセージが表示されることを確認
    await expect(page.locator('#toastMessage')).toBeVisible();
  });

  test('モバイルでのスクロールとビューポート', async ({ page }) => {
    // ブログタブの長いフォームでスクロールテスト
    await page.click('[data-tab="blog"]');

    // フォームの最上部のフィールドに入力
    await page.fill('#blog_topic_title', 'スクロールテスト');

    // 最下部までスクロール
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // 最下部のフィールドが表示されていることを確認
    await expect(page.locator('#blog_call_to_action')).toBeInViewport();

    // フィールドに入力
    await page.fill('#blog_call_to_action', 'モバイルCTA');
  });

  test('モバイルでの「その他」チェックボックス動作', async ({ page }) => {
    await page.click('[data-tab="email"]');

    // 「その他」をタップ
    await page.tap('#email_purpose_other_checkbox');

    // 追加フィールドが表示される
    await expect(page.locator('#email_purpose_other')).toBeVisible();

    // モバイルでも入力可能
    await page.fill('#email_purpose_other', 'モバイルカスタム用件');
  });

  test('モバイルでのテキストエリア入力', async ({ page }) => {
    await page.click('[data-tab="report"]');

    // 複数行のテキスト入力
    const multilineText = `モバイルから
複数行の
テキスト入力`;

    await page.fill('#report_discussion_points', multilineText);
    const value = await page.locator('#report_discussion_points').inputValue();
    expect(value).toContain('モバイルから');
  });
});

// iPad用のテスト
test.describe('タブレット表示テスト', () => {
  test.use({
    ...devices['iPad Pro'],
  });

  test('タブレットでの表示確認', async ({ page }) => {
    await page.goto('/');

    // タブレットでも全てのタブが表示される
    await expect(page.locator('.tab-button')).toHaveCount(5);

    // フォームが適切な幅で表示される
    const formContainer = page.locator('#emailFormContainer');
    await expect(formContainer).toBeVisible();

    // 生成ボタンとコピーボタンが適切に配置される
    await expect(page.locator('#generateBtn')).toBeVisible();
  });

  test('タブレットでの操作性', async ({ page }) => {
    await page.goto('/');

    // SNSタブでテスト
    await page.click('[data-tab="sns"]');

    // フォーム入力
    await page.selectOption('#sns_platform', 'LinkedIn');
    await page.fill('#sns_purpose', 'タブレットテスト');
    await page.fill('#sns_main_message', 'タブレットからの投稿');
    await page.selectOption('#sns_tone', 'プロフェッショナル');

    // プロンプト生成
    await page.click('#generateBtn');
    await expect(page.locator('#promptOutput')).not.toBeEmpty();

    // コピー機能
    await page.click('#copyBtn');
    await expect(page.locator('#toastMessage')).toBeVisible();
  });
});