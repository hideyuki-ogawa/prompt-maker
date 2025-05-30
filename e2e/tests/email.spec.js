import { test, expect } from '@playwright/test';

test.describe('メール作成機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-tab="email"]');
    await expect(page.locator('#emailFormContainer')).toBeVisible();
  });

  test('基本的なメール作成フロー', async ({ page }) => {
    // 用件の選択
    await page.check('input[name="email_purpose"][value="アポイント依頼"]');
    await page.check('input[name="email_purpose"][value="お礼"]');

    // フォーム入力
    await page.fill('#email_to_info', '株式会社テスト 山田太郎様');
    await page.fill('#email_sender_relation', '初めてご連絡させていただきます');
    await page.fill('#email_main_points', '- 製品デモのご依頼\n- 日程調整のお願い\n- 資料送付について');
    await page.fill('#email_keywords', '製品デモ, 日程調整, 資料');
    await page.selectOption('#email_tone', 'フォーマル');
    await page.fill('#email_call_to_action', 'ご都合の良い日時をお知らせください');
    await page.fill('#email_signature', '株式会社サンプル\n営業部 田中花子\nTEL: 03-1234-5678');

    // プロンプト生成
    await page.click('#generateBtn');

    // プロンプトが生成されたことを確認
    await expect(page.locator('#promptOutput')).not.toBeEmpty();
    await expect(page.locator('#promptOutput')).toContainText('メール作成');
    await expect(page.locator('#promptOutput')).toContainText('アポイント依頼');
    await expect(page.locator('#promptOutput')).toContainText('お礼');
    await expect(page.locator('#promptOutput')).toContainText('株式会社テスト 山田太郎様');
  });

  test('「その他」選択時の追加入力フィールド表示', async ({ page }) => {
    // 「その他」チェックボックスが最初は非表示
    await expect(page.locator('#email_purpose_other')).toBeHidden();

    // 「その他」を選択
    await page.check('#email_purpose_other_checkbox');

    // 追加入力フィールドが表示されることを確認
    await expect(page.locator('#email_purpose_other')).toBeVisible();

    // 追加入力フィールドに入力
    await page.fill('#email_purpose_other', 'カスタム用件のテスト');

    // 他のフィールドも入力
    await page.fill('#email_to_info', 'テスト宛先');
    await page.fill('#email_main_points', 'テスト内容');
    await page.selectOption('#email_tone', 'カジュアル');

    // プロンプト生成
    await page.click('#generateBtn');

    // カスタム用件が含まれることを確認
    await expect(page.locator('#promptOutput')).toContainText('カスタム用件のテスト');
  });

  test('複数の用件選択', async ({ page }) => {
    // 複数の用件を選択
    await page.check('input[name="email_purpose"][value="情報共有"]');
    await page.check('input[name="email_purpose"][value="問い合わせ"]');
    await page.check('input[name="email_purpose"][value="提案"]');

    // 必須フィールドを入力
    await page.fill('#email_to_info', 'テスト宛先');
    await page.fill('#email_main_points', 'テストポイント');
    await page.selectOption('#email_tone', 'フォーマル');

    // プロンプト生成
    await page.click('#generateBtn');

    // 選択した用件がすべて含まれることを確認
    await expect(page.locator('#promptOutput')).toContainText('情報共有');
    await expect(page.locator('#promptOutput')).toContainText('問い合わせ');
    await expect(page.locator('#promptOutput')).toContainText('提案');
  });

  test('コピー機能', async ({ page }) => {
    // 最小限の入力
    await page.check('input[name="email_purpose"][value="お礼"]');
    await page.fill('#email_to_info', 'テスト宛先');
    await page.fill('#email_main_points', 'テスト内容');
    await page.selectOption('#email_tone', 'フォーマル');

    // プロンプト生成
    await page.click('#generateBtn');

    // コピーボタンをクリック
    await page.click('#copyBtn');

    // トーストメッセージが表示されることを確認
    await expect(page.locator('#toastMessage')).toBeVisible();
    await expect(page.locator('#toastMessage')).toContainText('コピーしました');

    // トーストメッセージが消えることを確認
    await expect(page.locator('#toastMessage')).toBeHidden({ timeout: 5000 });
  });

  test('必須フィールドの検証', async ({ page }) => {
    // 用件を選択せずに生成ボタンをクリック
    await page.click('#generateBtn');

    // ブラウザのバリデーションメッセージを確認（用件の選択）
    const emailPurposeCheckbox = page.locator('input[name="email_purpose"]').first();
    await expect(emailPurposeCheckbox).toHaveJSProperty('validity.valueMissing', true);
  });
});