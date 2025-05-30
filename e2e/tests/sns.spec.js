import { test, expect } from '@playwright/test';

test.describe('SNS投稿作成機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-tab="sns"]');
    await expect(page.locator('#snsFormContainer')).toBeVisible();
  });

  test('Twitter投稿の作成フロー', async ({ page }) => {
    // プラットフォーム選択
    await page.selectOption('#sns_platform', 'Twitter');

    // フォーム入力
    await page.fill('#sns_purpose', '新製品の発表');
    await page.fill('#sns_target_audience', 'IT業界のプロフェッショナル、技術に興味がある人');
    await page.fill('#sns_main_message', '革新的なAIツールがついに登場！\n作業効率を大幅に向上させる新機能を搭載');
    await page.fill('#sns_keywords_hashtags', '#AI #イノベーション #新製品 #テクノロジー');
    await page.selectOption('#sns_tone', 'カジュアル');
    await page.fill('#sns_call_to_action', '詳細はリンクから→');
    await page.fill('#sns_image_video_info', '製品のスクリーンショット画像を添付');

    // プロンプト生成
    await page.click('#generateBtn');

    // プロンプトが生成されたことを確認
    await expect(page.locator('#promptOutput')).not.toBeEmpty();
    await expect(page.locator('#promptOutput')).toContainText('Twitter');
    await expect(page.locator('#promptOutput')).toContainText('新製品の発表');
    await expect(page.locator('#promptOutput')).toContainText('#AI');
  });

  test('Instagram投稿の作成フロー', async ({ page }) => {
    // プラットフォーム選択
    await page.selectOption('#sns_platform', 'Instagram');

    // フォーム入力
    await page.fill('#sns_purpose', 'ブランド認知度向上');
    await page.fill('#sns_target_audience', '20-30代の女性');
    await page.fill('#sns_main_message', '春の新作コレクションが到着！\n優しい色合いで日常を彩ります');
    await page.fill('#sns_keywords_hashtags', '#春コーデ #ファッション #新作 #ootd');
    await page.selectOption('#sns_tone', 'フレンドリー');
    await page.fill('#sns_call_to_action', 'プロフィールのリンクからチェック');
    await page.fill('#sns_image_video_info', '新作アイテムを着用したモデル写真（3枚）');

    // プロンプト生成
    await page.click('#generateBtn');

    // プロンプトが生成されたことを確認
    await expect(page.locator('#promptOutput')).toContainText('Instagram');
    await expect(page.locator('#promptOutput')).toContainText('ブランド認知度向上');
    await expect(page.locator('#promptOutput')).toContainText('20-30代の女性');
  });

  test('LinkedIn投稿の作成フロー', async ({ page }) => {
    // プラットフォーム選択
    await page.selectOption('#sns_platform', 'LinkedIn');

    // フォーム入力
    await page.fill('#sns_purpose', '業界の知見共有');
    await page.fill('#sns_target_audience', 'ビジネスプロフェッショナル、経営者');
    await page.fill('#sns_main_message', 'DXの成功には組織文化の変革が不可欠。\n最新の調査結果から見えてきた3つのポイント');
    await page.fill('#sns_keywords_hashtags', '#DX #デジタルトランスフォーメーション #組織改革');
    await page.selectOption('#sns_tone', 'プロフェッショナル');
    await page.fill('#sns_call_to_action', 'ご意見をコメント欄でお聞かせください');
    await page.fill('#sns_image_video_info', 'インフォグラフィック画像');

    // プロンプト生成
    await page.click('#generateBtn');

    // プロンプトが生成されたことを確認
    await expect(page.locator('#promptOutput')).toContainText('LinkedIn');
    await expect(page.locator('#promptOutput')).toContainText('プロフェッショナル');
  });

  test('Facebook投稿の作成フロー', async ({ page }) => {
    // プラットフォーム選択
    await page.selectOption('#sns_platform', 'Facebook');

    // フォーム入力
    await page.fill('#sns_purpose', 'コミュニティへの感謝');
    await page.fill('#sns_target_audience', '地域のフォロワー、常連客');
    await page.fill('#sns_main_message', 'おかげさまで開店5周年！\n皆様への感謝の気持ちを込めて特別キャンペーンを実施します');
    await page.fill('#sns_keywords_hashtags', '#5周年 #感謝 #キャンペーン');
    await page.selectOption('#sns_tone', 'フレンドリー');
    await page.fill('#sns_call_to_action', '詳細は店頭で！');

    // プロンプト生成
    await page.click('#generateBtn');

    // プロンプトが生成されたことを確認
    await expect(page.locator('#promptOutput')).toContainText('Facebook');
    await expect(page.locator('#promptOutput')).toContainText('5周年');
  });

  test('全フィールド入力時のプロンプト生成', async ({ page }) => {
    // すべてのフィールドに入力
    await page.selectOption('#sns_platform', 'その他');
    await page.fill('#sns_purpose', 'テスト目的');
    await page.fill('#sns_target_audience', 'テストターゲット');
    await page.fill('#sns_main_message', 'テストメッセージ\n複数行のテキスト');
    await page.fill('#sns_keywords_hashtags', '#test1 #test2 #test3');
    await page.selectOption('#sns_tone', 'ユーモラス');
    await page.fill('#sns_call_to_action', 'テストCTA');
    await page.fill('#sns_image_video_info', 'テスト画像情報');

    // プロンプト生成
    await page.click('#generateBtn');

    // すべての入力が反映されていることを確認
    await expect(page.locator('#promptOutput')).toContainText('その他');
    await expect(page.locator('#promptOutput')).toContainText('テスト目的');
    await expect(page.locator('#promptOutput')).toContainText('テストターゲット');
    await expect(page.locator('#promptOutput')).toContainText('テストメッセージ');
    await expect(page.locator('#promptOutput')).toContainText('#test1');
    await expect(page.locator('#promptOutput')).toContainText('ユーモラス');
    await expect(page.locator('#promptOutput')).toContainText('テストCTA');
    await expect(page.locator('#promptOutput')).toContainText('テスト画像情報');
  });
});