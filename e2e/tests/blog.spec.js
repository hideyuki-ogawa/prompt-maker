import { test, expect } from '@playwright/test';

test.describe('ブログ記事作成機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-tab="blog"]');
    await expect(page.locator('#blogFormContainer')).toBeVisible();
  });

  test('技術ブログ記事の作成フロー', async ({ page }) => {
    // フォーム入力
    await page.fill('#blog_topic_title', 'AIツール導入による業務効率化の実現');
    await page.fill('#blog_target_reader', 'IT部門の管理職、DX推進担当者');
    await page.fill('#blog_reader_benefit', '- AIツール導入の具体的な手順がわかる\n- ROI計算方法が理解できる\n- 失敗しないための注意点を知れる');
    await page.fill('#blog_seo_keywords', 'AI導入, 業務効率化, DX, ROI, 生産性向上');
    await page.selectOption('#blog_style_tone', '解説調');
    await page.fill('#blog_structure_outline', '1. はじめに\n2. AIツール導入のメリット\n3. 導入プロセス\n4. ROI計算方法\n5. 注意点とベストプラクティス\n6. まとめ');
    await page.fill('#blog_reference_material', '- 最新のAI市場調査レポート\n- 導入事例3件\n- 専門家インタビュー');
    await page.fill('#blog_call_to_action', '無料相談のお申し込みはこちら');

    // プロンプト生成
    await page.click('#generateBtn');

    // プロンプトが生成されたことを確認
    await expect(page.locator('#promptOutput')).not.toBeEmpty();
    await expect(page.locator('#promptOutput')).toContainText('AIツール導入による業務効率化の実現');
    await expect(page.locator('#promptOutput')).toContainText('IT部門の管理職');
    await expect(page.locator('#promptOutput')).toContainText('解説調');
  });

  test('ライフスタイルブログ記事の作成フロー', async ({ page }) => {
    // フォーム入力
    await page.fill('#blog_topic_title', '在宅ワークで集中力を保つ5つの方法');
    await page.fill('#blog_target_reader', 'リモートワーカー、フリーランス');
    await page.fill('#blog_reader_benefit', '- 集中力が途切れる原因がわかる\n- すぐに実践できる具体的な方法を知れる\n- 生産性向上のヒントが得られる');
    await page.fill('#blog_seo_keywords', '在宅ワーク, リモートワーク, 集中力, 生産性, ワークライフバランス');
    await page.selectOption('#blog_style_tone', 'フレンドリー');
    await page.fill('#blog_structure_outline', '1. 導入（共感を呼ぶストーリー）\n2. 方法1: 作業環境の最適化\n3. 方法2: 時間管理テクニック\n4. 方法3: 休憩の取り方\n5. 方法4: デジタルデトックス\n6. 方法5: 運動と栄養\n7. まとめ');
    await page.fill('#blog_reference_material', '個人的な経験談、心理学の研究結果');
    await page.fill('#blog_call_to_action', 'ニュースレター登録で詳細ガイドをプレゼント');

    // プロンプト生成
    await page.click('#generateBtn');

    // プロンプトが生成されたことを確認
    await expect(page.locator('#promptOutput')).toContainText('在宅ワーク');
    await expect(page.locator('#promptOutput')).toContainText('フレンドリー');
    await expect(page.locator('#promptOutput')).toContainText('リモートワーカー');
  });

  test('専門的な解説記事の作成フロー', async ({ page }) => {
    // フォーム入力
    await page.fill('#blog_topic_title', 'ブロックチェーン技術の基礎と応用');
    await page.fill('#blog_target_reader', '技術者、エンジニア、IT学習者');
    await page.fill('#blog_reader_benefit', '- ブロックチェーンの仕組みを理解できる\n- 実装方法の基礎がわかる\n- 実用例を知ることができる');
    await page.fill('#blog_seo_keywords', 'ブロックチェーン, 分散型台帳, 暗号化, スマートコントラクト, Web3');
    await page.selectOption('#blog_style_tone', '専門的');
    await page.fill('#blog_structure_outline', '1. ブロックチェーンとは\n2. 技術的な仕組み\n3. コンセンサスアルゴリズム\n4. スマートコントラクト\n5. 実装例とコード\n6. 今後の展望');
    await page.fill('#blog_reference_material', '技術仕様書、学術論文、GitHubリポジトリ');
    await page.fill('#blog_call_to_action', '技術セミナーへの参加申し込み');

    // プロンプト生成
    await page.click('#generateBtn');

    // プロンプトが生成されたことを確認
    await expect(page.locator('#promptOutput')).toContainText('ブロックチェーン');
    await expect(page.locator('#promptOutput')).toContainText('専門的');
    await expect(page.locator('#promptOutput')).toContainText('技術者');
  });

  test('SEO最適化を重視した記事作成', async ({ page }) => {
    // フォーム入力
    await page.fill('#blog_topic_title', '2024年最新SEO対策完全ガイド');
    await page.fill('#blog_target_reader', 'Webマーケター、ブログ運営者、中小企業の経営者');
    await page.fill('#blog_reader_benefit', '- 最新のSEOトレンドがわかる\n- 具体的な施策を学べる\n- 競合に差をつける方法を知れる');
    await page.fill('#blog_seo_keywords', 'SEO対策, 検索エンジン最適化, Google, コンテンツマーケティング, 2024');
    await page.selectOption('#blog_style_tone', 'インタビュー風');
    await page.fill('#blog_structure_outline', '1. 2024年のSEOトレンド\n2. コンテンツ戦略\n3. テクニカルSEO\n4. ローカルSEO\n5. 測定と改善\n6. アクションプラン');
    await page.fill('#blog_call_to_action', 'SEO診断ツールの無料トライアル');

    // プロンプト生成
    await page.click('#generateBtn');

    // プロンプトが生成されたことを確認
    await expect(page.locator('#promptOutput')).toContainText('2024年最新SEO対策');
    await expect(page.locator('#promptOutput')).toContainText('SEO対策');
    await expect(page.locator('#promptOutput')).toContainText('インタビュー風');
  });

  test('最小限の入力での記事作成', async ({ page }) => {
    // 必須フィールドのみ入力
    await page.fill('#blog_topic_title', 'シンプルなテスト記事');
    await page.fill('#blog_target_reader', '一般読者');
    await page.fill('#blog_reader_benefit', 'テストの利点');
    await page.selectOption('#blog_style_tone', 'フレンドリー');

    // プロンプト生成
    await page.click('#generateBtn');

    // プロンプトが生成されたことを確認
    await expect(page.locator('#promptOutput')).not.toBeEmpty();
    await expect(page.locator('#promptOutput')).toContainText('シンプルなテスト記事');
    await expect(page.locator('#promptOutput')).toContainText('一般読者');
  });
});