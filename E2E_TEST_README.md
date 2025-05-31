# E2Eテストガイド

## 概要
このプロジェクトでは、Playwrightを使用してE2Eテストを実装しています。

## テストの実行

### 全テストの実行
```bash
npm run test:e2e
```

### 特定のブラウザでの実行
```bash
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit
```

### UIモードでの実行（デバッグ用）
```bash
npm run test:e2e:ui
```

### ヘッドフルモードでの実行（ブラウザを表示）
```bash
npm run test:e2e:headed
```

## テスト構成
- `e2e/tests/email.spec.js` - メール作成機能のテスト
- `e2e/tests/sns.spec.js` - SNS投稿作成機能のテスト
- `e2e/tests/blog.spec.js` - ブログ記事作成機能のテスト
- `e2e/tests/report.spec.js` - 訪問報告書作成機能のテスト
- `e2e/tests/ui-operations.spec.js` - UI操作全般のテスト
- `e2e/tests/mobile.spec.js` - モバイル/タブレット表示のテスト
- `e2e/tests/simple-test.spec.js` - 基本的な動作確認テスト

## 既知の問題

### モバイルテストの失敗
モバイルおよびタブレットのテスト（mobile.spec.js）は、特定の環境で以下のエラーが発生する場合があります：

```
Host system is missing dependencies to run browsers.
Missing libraries:
    libgtk-4.so.1
    libevent-2.1.so.7
    libgstcodecparsers-1.0.so.0
    libavif.so.13
```

**解決方法**：
1. Ubuntu/Debian系の場合：
   ```bash
   sudo apt-get update
   sudo apt-get install -y libgtk-4-1 libevent-2.1-7 libgstreamer-plugins-bad1.0-0 libavif13
   ```

2. または、Playwrightの依存関係を再インストール：
   ```bash
   npx playwright install-deps
   ```

3. モバイルテストを除外して実行：
   ```bash
   npm run test:e2e -- --grep-invert "モバイル|タブレット"
   ```

### チェックボックスのバリデーション
現在の実装では、メールフォームのチェックボックスグループにHTML5のバリデーションが適用されていません。
そのため、用件を選択せずにプロンプトを生成できてしまいます（用件は「指定なし」として処理されます）。

## テスト結果
2025年5月現在：
- デスクトップテスト: 29/29 成功
- モバイル/タブレットテスト: 環境依存で失敗する可能性あり（8テスト）

## CI/CD
GitHub Actionsで自動実行されます（`.github/workflows/e2e.yml`）
- プルリクエスト時に自動実行
- Chromium、Firefox、WebKitで並列実行
- テスト結果とスクリーンショットをアーティファクトとして保存