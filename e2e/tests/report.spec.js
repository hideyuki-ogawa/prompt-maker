import { test, expect } from '@playwright/test';

test.describe('訪問報告書作成機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-tab="report"]');
    await expect(page.locator('#reportFormContainer')).toBeVisible();
  });

  test('営業訪問報告書の作成フロー', async ({ page }) => {
    // フォーム入力
    await page.fill('#report_visit_date', '2024-03-15');
    await page.fill('#report_client_info', '株式会社ABC商事 営業部 山田部長、田中課長');
    await page.fill('#report_our_attendees', '営業部 鈴木、技術部 佐藤');
    await page.fill('#report_purpose', '新製品のご提案および導入スケジュールの協議');
    await page.fill('#report_discussion_points', '1. 新製品の機能説明\n2. 導入メリットの説明\n3. 価格とライセンス体系\n4. 導入スケジュール\n5. サポート体制');
    await page.fill('#report_decisions_agreements', '- 4月より試験導入開始\n- 初期導入は50ライセンス\n- 月次レビューミーティング実施');
    await page.fill('#report_pending_issues', '- セキュリティ要件の詳細確認\n- カスタマイズ範囲の検討');
    await page.fill('#report_next_actions', '- 3/20までに見積書提出\n- 3/25にセキュリティ要件確認会議\n- 4/1に導入キックオフ');
    await page.fill('#report_impressions_notes', '非常に前向きな反応。競合他社との比較で優位性を評価いただいた。');
    await page.fill('#report_special_mention', '決裁者の専務も途中参加され、好感触を得た');

    // プロンプト生成
    await page.click('#generateBtn');

    // プロンプトが生成されたことを確認
    await expect(page.locator('#promptOutput')).not.toBeEmpty();
    await expect(page.locator('#promptOutput')).toContainText('2024-03-15');
    await expect(page.locator('#promptOutput')).toContainText('株式会社ABC商事');
    await expect(page.locator('#promptOutput')).toContainText('新製品のご提案');
  });

  test('技術サポート訪問報告書の作成フロー', async ({ page }) => {
    // フォーム入力
    await page.fill('#report_visit_date', '2024-03-10');
    await page.fill('#report_client_info', 'XYZ製造株式会社 情報システム部');
    await page.fill('#report_our_attendees', 'サポート部 高橋、エンジニア 伊藤');
    await page.fill('#report_purpose', 'システム障害の原因調査と対策実施');
    await page.fill('#report_discussion_points', '- 障害発生状況のヒアリング\n- ログ解析結果の共有\n- 暫定対策の実施\n- 恒久対策の提案');
    await page.fill('#report_decisions_agreements', '- 暫定対策として設定変更を実施\n- 次回アップデートで根本対策');
    await page.fill('#report_pending_issues', '- パフォーマンス改善要望への対応');
    await page.fill('#report_next_actions', '- 週次で状況モニタリング\n- 3/31にアップデート実施');
    await page.fill('#report_impressions_notes', '迅速な対応を評価いただいた。今後の改善提案も歓迎された。');

    // プロンプト生成
    await page.click('#generateBtn');

    // プロンプトが生成されたことを確認
    await expect(page.locator('#promptOutput')).toContainText('システム障害');
    await expect(page.locator('#promptOutput')).toContainText('サポート部');
    await expect(page.locator('#promptOutput')).toContainText('暫定対策');
  });

  test('定期訪問報告書の作成フロー', async ({ page }) => {
    // フォーム入力
    await page.fill('#report_visit_date', '2024-03-20');
    await page.fill('#report_client_info', '〇〇商店 代表 〇〇様');
    await page.fill('#report_our_attendees', '営業部 山本');
    await page.fill('#report_purpose', '定期訪問（月次）');
    await page.fill('#report_discussion_points', '- 前月の売上状況確認\n- 在庫状況の確認\n- 新商品の案内');
    await page.fill('#report_decisions_agreements', '- 春の新商品10点を発注');
    await page.fill('#report_next_actions', '- 3/25に商品配送\n- 4月中旬に次回訪問');
    await page.fill('#report_impressions_notes', '売上好調。新商品への関心も高い。');

    // プロンプト生成
    await page.click('#generateBtn');

    // プロンプトが生成されたことを確認
    await expect(page.locator('#promptOutput')).toContainText('定期訪問');
    await expect(page.locator('#promptOutput')).toContainText('月次');
  });

  test('コンサルティング訪問報告書の作成フロー', async ({ page }) => {
    // フォーム入力
    await page.fill('#report_visit_date', '2024-03-18');
    await page.fill('#report_client_info', '△△ホールディングス 経営企画部 部長、課長2名');
    await page.fill('#report_our_attendees', 'コンサルティング部 シニアマネージャー 田村、コンサルタント 木村');
    await page.fill('#report_purpose', 'DX推進プロジェクト第2フェーズのキックオフ');
    await page.fill('#report_discussion_points', '1. 第1フェーズの振り返り\n2. 第2フェーズの目標設定\n3. 推進体制の確認\n4. スケジュール調整\n5. 予算配分');
    await page.fill('#report_decisions_agreements', '- プロジェクトチームを10名体制に拡充\n- 月2回の定例会議を設定\n- Q2末までに基本設計完了');
    await page.fill('#report_pending_issues', '- 外部ベンダー選定基準の策定\n- 社内調整のための説明会日程');
    await page.fill('#report_next_actions', '- 3/25 推進体制図の提出\n- 3/28 第1回定例会議\n- 4/5 全社説明会の実施');
    await page.fill('#report_impressions_notes', '経営層の強いコミットメントを確認。プロジェクト成功への期待が高い。');
    await page.fill('#report_special_mention', 'CEOから直接激励のメッセージをいただいた');

    // プロンプト生成
    await page.click('#generateBtn');

    // プロンプトが生成されたことを確認
    await expect(page.locator('#promptOutput')).toContainText('DX推進プロジェクト');
    await expect(page.locator('#promptOutput')).toContainText('コンサルティング部');
    await expect(page.locator('#promptOutput')).toContainText('第2フェーズ');
    await expect(page.locator('#promptOutput')).toContainText('CEO');
  });

  test('日付入力とフォーマット', async ({ page }) => {
    // 様々な日付フォーマットをテスト
    await page.fill('#report_visit_date', '2024-12-31');
    await page.fill('#report_client_info', 'テスト企業');
    await page.fill('#report_our_attendees', 'テスト担当者');
    await page.fill('#report_purpose', 'テスト訪問');

    // プロンプト生成
    await page.click('#generateBtn');

    // 日付が正しく表示されることを確認
    await expect(page.locator('#promptOutput')).toContainText('2024-12-31');
  });
});