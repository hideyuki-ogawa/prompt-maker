# Test info

- Name: モバイル表示テスト >> モバイルでのタブ表示とスクロール
- Location: /home/hideyuki/llm-dev-test/promp-gemini/e2e/tests/mobile.spec.js:13:7

# Error details

```
Error: browserType.launch: 
╔══════════════════════════════════════════════════════╗
║ Host system is missing dependencies to run browsers. ║
║ Missing libraries:                                   ║
║     libgtk-4.so.1                                    ║
║     libevent-2.1.so.7                                ║
║     libgstcodecparsers-1.0.so.0                      ║
║     libavif.so.13                                    ║
╚══════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | import { test, expect, devices } from '@playwright/test';
   2 |
   3 | // モバイルデバイスの設定
   4 | test.use({
   5 |   ...devices['iPhone 12'],
   6 | });
   7 |
   8 | test.describe('モバイル表示テスト', () => {
   9 |   test.beforeEach(async ({ page }) => {
   10 |     await page.goto('/');
   11 |   });
   12 |
>  13 |   test('モバイルでのタブ表示とスクロール', async ({ page }) => {
      |       ^ Error: browserType.launch: 
   14 |     // タブがモバイルでも表示されることを確認
   15 |     await expect(page.locator('.tab-button')).toHaveCount(5);
   16 |
   17 |     // タブがスクロール可能または適切に折り返されることを確認
   18 |     const tabContainer = page.locator('.tabs');
   19 |     await expect(tabContainer).toBeVisible();
   20 |
   21 |     // 各タブをクリックして動作確認
   22 |     await page.click('[data-tab="sns"]');
   23 |     await expect(page.locator('#snsFormContainer')).toBeVisible();
   24 |
   25 |     await page.click('[data-tab="blog"]');
   26 |     await expect(page.locator('#blogFormContainer')).toBeVisible();
   27 |   });
   28 |
   29 |   test('モバイルでのフォーム入力', async ({ page }) => {
   30 |     // メールフォームでの入力テスト
   31 |     await page.click('[data-tab="email"]');
   32 |
   33 |     // チェックボックスのタップ
   34 |     await page.tap('input[name="email_purpose"][value="お礼"]');
   35 |     await expect(page.locator('input[name="email_purpose"][value="お礼"]')).toBeChecked();
   36 |
   37 |     // テキスト入力（モバイルキーボード対応）
   38 |     await page.tap('#email_to_info');
   39 |     await page.fill('#email_to_info', 'モバイルテスト');
   40 |
   41 |     // セレクトボックスの操作
   42 |     await page.selectOption('#email_tone', 'カジュアル');
   43 |     await expect(page.locator('#email_tone')).toHaveValue('カジュアル');
   44 |   });
   45 |
   46 |   test('モバイルでのプロンプト生成とコピー', async ({ page }) => {
   47 |     await page.click('[data-tab="sns"]');
   48 |
   49 |     // 最小限の入力
   50 |     await page.selectOption('#sns_platform', 'Twitter');
   51 |     await page.fill('#sns_purpose', 'モバイルテスト');
   52 |     await page.fill('#sns_target_audience', 'テストユーザー');
   53 |     await page.fill('#sns_main_message', 'モバイルからの投稿テスト');
   54 |     await page.selectOption('#sns_tone', 'カジュアル');
   55 |
   56 |     // 生成ボタンのタップ
   57 |     await page.tap('#generateBtn');
   58 |
   59 |     // プロンプトが表示されることを確認
   60 |     await expect(page.locator('#promptOutput')).not.toBeEmpty();
   61 |
   62 |     // コピーボタンのタップ
   63 |     await page.tap('#copyBtn');
   64 |
   65 |     // トーストメッセージが表示されることを確認
   66 |     await expect(page.locator('#toastMessage')).toBeVisible();
   67 |   });
   68 |
   69 |   test('モバイルでのスクロールとビューポート', async ({ page }) => {
   70 |     // ブログタブの長いフォームでスクロールテスト
   71 |     await page.click('[data-tab="blog"]');
   72 |
   73 |     // フォームの最上部のフィールドに入力
   74 |     await page.fill('#blog_topic_title', 'スクロールテスト');
   75 |
   76 |     // 最下部までスクロール
   77 |     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
   78 |
   79 |     // 最下部のフィールドが表示されていることを確認
   80 |     await expect(page.locator('#blog_call_to_action')).toBeInViewport();
   81 |
   82 |     // フィールドに入力
   83 |     await page.fill('#blog_call_to_action', 'モバイルCTA');
   84 |   });
   85 |
   86 |   test('モバイルでの「その他」チェックボックス動作', async ({ page }) => {
   87 |     await page.click('[data-tab="email"]');
   88 |
   89 |     // 「その他」をタップ
   90 |     await page.tap('#email_purpose_other_checkbox');
   91 |
   92 |     // 追加フィールドが表示される
   93 |     await expect(page.locator('#email_purpose_other')).toBeVisible();
   94 |
   95 |     // モバイルでも入力可能
   96 |     await page.fill('#email_purpose_other', 'モバイルカスタム用件');
   97 |   });
   98 |
   99 |   test('モバイルでのテキストエリア入力', async ({ page }) => {
  100 |     await page.click('[data-tab="report"]');
  101 |
  102 |     // 複数行のテキスト入力
  103 |     const multilineText = `モバイルから
  104 | 複数行の
  105 | テキスト入力`;
  106 |
  107 |     await page.fill('#report_discussion_points', multilineText);
  108 |     const value = await page.locator('#report_discussion_points').inputValue();
  109 |     expect(value).toContain('モバイルから');
  110 |   });
  111 | });
  112 |
  113 | // iPad用のテスト
```