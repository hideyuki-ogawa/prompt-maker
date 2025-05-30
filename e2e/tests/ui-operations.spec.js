import { test, expect } from '@playwright/test';

test.describe('UI操作テスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('タブ切り替え機能', async ({ page }) => {
    // 初期状態はメール作成タブがアクティブ
    await expect(page.locator('[data-tab="email"]')).toHaveClass(/active/);
    await expect(page.locator('#emailFormContainer')).toBeVisible();

    // SNS投稿タブに切り替え
    await page.click('[data-tab="sns"]');
    await expect(page.locator('[data-tab="sns"]')).toHaveClass(/active/);
    await expect(page.locator('#snsFormContainer')).toBeVisible();
    await expect(page.locator('#emailFormContainer')).toBeHidden();

    // ブログ記事タブに切り替え
    await page.click('[data-tab="blog"]');
    await expect(page.locator('[data-tab="blog"]')).toHaveClass(/active/);
    await expect(page.locator('#blogFormContainer')).toBeVisible();

    // 訪問報告書タブに切り替え
    await page.click('[data-tab="report"]');
    await expect(page.locator('[data-tab="report"]')).toHaveClass(/active/);
    await expect(page.locator('#reportFormContainer')).toBeVisible();

    // フィードバックタブに切り替え
    await page.click('[data-tab="feedback"]');
    await expect(page.locator('[data-tab="feedback"]')).toHaveClass(/active/);
    await expect(page.locator('#feedbackFormContainer')).toBeVisible();
  });

  test('複数チェックボックスの選択と解除', async ({ page }) => {
    // メールタブで複数のチェックボックスを操作
    await page.click('[data-tab="email"]');

    // 複数選択
    await page.check('input[name="email_purpose"][value="アポイント依頼"]');
    await page.check('input[name="email_purpose"][value="お礼"]');
    await page.check('input[name="email_purpose"][value="情報共有"]');

    // 選択状態を確認
    await expect(page.locator('input[name="email_purpose"][value="アポイント依頼"]')).toBeChecked();
    await expect(page.locator('input[name="email_purpose"][value="お礼"]')).toBeChecked();
    await expect(page.locator('input[name="email_purpose"][value="情報共有"]')).toBeChecked();

    // 一部を解除
    await page.uncheck('input[name="email_purpose"][value="お礼"]');
    await expect(page.locator('input[name="email_purpose"][value="お礼"]')).not.toBeChecked();
    await expect(page.locator('input[name="email_purpose"][value="アポイント依頼"]')).toBeChecked();
  });

  test('「その他」チェックボックスと追加入力フィールドの連動', async ({ page }) => {
    await page.click('[data-tab="email"]');

    // 初期状態では追加入力フィールドは非表示
    await expect(page.locator('#email_purpose_other')).toBeHidden();

    // 「その他」をチェック
    await page.check('#email_purpose_other_checkbox');

    // 追加入力フィールドが表示される
    await expect(page.locator('#email_purpose_other')).toBeVisible();

    // 追加入力フィールドに入力
    await page.fill('#email_purpose_other', 'カスタム用件');
    await expect(page.locator('#email_purpose_other')).toHaveValue('カスタム用件');

    // 「その他」のチェックを外す
    await page.uncheck('#email_purpose_other_checkbox');

    // 追加入力フィールドが非表示になる
    await expect(page.locator('#email_purpose_other')).toBeHidden();
  });

  test('プロンプト生成とコピー機能の統合テスト', async ({ page }) => {
    // SNSタブでテスト
    await page.click('[data-tab="sns"]');

    // フォーム入力
    await page.selectOption('#sns_platform', 'Twitter');
    await page.fill('#sns_purpose', 'テスト投稿');
    await page.fill('#sns_target_audience', 'テストユーザー');
    await page.fill('#sns_main_message', 'これはテストメッセージです');
    await page.selectOption('#sns_tone', 'カジュアル');

    // 生成ボタンをクリック
    await page.click('#generateBtn');

    // プロンプトが表示される
    await expect(page.locator('#promptOutput')).not.toBeEmpty();
    const promptText = await page.locator('#promptOutput').textContent();
    expect(promptText).toContain('Twitter');
    expect(promptText).toContain('テスト投稿');

    // コピーボタンをクリック
    await page.click('#copyBtn');

    // トーストメッセージが表示される
    await expect(page.locator('#toastMessage')).toBeVisible();
    await expect(page.locator('#toastMessage')).toContainText('コピーしました');

    // トーストメッセージが自動的に消える
    await page.waitForTimeout(3000);
    await expect(page.locator('#toastMessage')).toBeHidden();
  });

  test('セレクトボックスの操作', async ({ page }) => {
    // メールタブのトーン選択
    await page.click('[data-tab="email"]');
    await page.selectOption('#email_tone', 'フォーマル');
    await expect(page.locator('#email_tone')).toHaveValue('フォーマル');

    await page.selectOption('#email_tone', 'カジュアル');
    await expect(page.locator('#email_tone')).toHaveValue('カジュアル');

    // SNSタブのプラットフォーム選択
    await page.click('[data-tab="sns"]');
    await page.selectOption('#sns_platform', 'Instagram');
    await expect(page.locator('#sns_platform')).toHaveValue('Instagram');

    // ブログタブのスタイル選択
    await page.click('[data-tab="blog"]');
    await page.selectOption('#blog_style_tone', '専門的・権威的');
    await expect(page.locator('#blog_style_tone')).toHaveValue('専門的・権威的');
  });

  test('テキストエリアへの複数行入力', async ({ page }) => {
    await page.click('[data-tab="blog"]');

    const multilineText = `1. はじめに
2. 本文の内容
   - サブポイント1
   - サブポイント2
3. まとめ`;

    await page.fill('#blog_structure_outline', multilineText);
    const value = await page.locator('#blog_structure_outline').inputValue();
    expect(value).toContain('1. はじめに');
    expect(value).toContain('サブポイント1');
  });

  test('日付入力フィールド', async ({ page }) => {
    await page.click('[data-tab="report"]');

    // 日付を入力
    await page.fill('#report_visit_date', '2024-12-25');
    await expect(page.locator('#report_visit_date')).toHaveValue('2024-12-25');

    // 日付ピッカーを使用した入力もテスト可能
    await page.locator('#report_visit_date').clear();
    await page.locator('#report_visit_date').type('2024-01-01');
    await expect(page.locator('#report_visit_date')).toHaveValue('2024-01-01');
  });

  test('フォームのリセット（タブ切り替え時の状態保持）', async ({ page }) => {
    // メールタブで入力
    await page.click('[data-tab="email"]');
    await page.check('input[name="email_purpose"][value="お礼"]');
    await page.fill('#email_to_info', 'テスト宛先');

    // 別のタブに切り替え
    await page.click('[data-tab="sns"]');
    await page.fill('#sns_purpose', 'SNSテスト');

    // メールタブに戻る
    await page.click('[data-tab="email"]');

    // 入力内容が保持されていることを確認
    await expect(page.locator('input[name="email_purpose"][value="お礼"]')).toBeChecked();
    await expect(page.locator('#email_to_info')).toHaveValue('テスト宛先');
  });
});