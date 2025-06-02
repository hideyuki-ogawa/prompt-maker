# 開発者向けドキュメント

## ディレクトリ構造

```
/
├── modules/
│   ├── forms/           # フォーム関連モジュール
│   │   ├── config.js    # フォーム設定データ
│   │   ├── formBuilder.js    # 動的フォーム生成
│   │   ├── promptGenerators.js    # プロンプト生成関数
│   │   └── index.js     # エクスポート統合
│   └── utils/           # ユーティリティモジュール
│       ├── clipboard.js # クリップボード操作
│       ├── toast.js     # トースト通知
│       └── index.js     # エクスポート統合
├── main.js              # メインアプリケーションロジック
├── index.html           # HTMLテンプレート
└── style.css            # スタイルシート
```

## モジュール詳細

### フォームモジュール (modules/forms/)

- **config.js** - フォーム設定データ
  - 各タブ（メール、SNS、ブログ、レポート、フィードバック）の設定
  - フィールド定義（ID、ラベル、タイプ、プレースホルダーなど）
  - タブの表示順序

- **formBuilder.js** - 動的フォーム生成モジュール
  - `createFormField()` - 個別のフォームフィールドを生成
  - `createFormContainer()` - フォームコンテナを生成
  - `createTabButton()` - タブボタンを生成

- **promptGenerators.js** - プロンプト生成関数
  - `generateEmailPrompt()` - メール用プロンプト生成
  - `generateSnsPrompt()` - SNS投稿用プロンプト生成
  - `generateBlogPrompt()` - ブログ記事用プロンプト生成
  - `generateReportPrompt()` - 訪問報告書用プロンプト生成

### ユーティリティモジュール (modules/utils/)

- **clipboard.js** - クリップボード操作
  - `copyToClipboard()` - テキストをクリップボードにコピー
  - フォールバック機能付き

- **toast.js** - トースト通知
  - `initToast()` - トースト要素を初期化
  - `showToast()` - トーストメッセージを表示

### メインアプリケーション

- **main.js** - メインアプリケーションロジック
  - 初期化処理
  - イベントハンドリング
  - フォームデータ収集
  - UI状態管理

### 新しいタブ・フィールドの追加方法

1. `config.js`の`formConfig`オブジェクトに新しいタブの設定を追加
2. `tabOrder`配列に新しいタブIDを追加
3. `promptGenerators.js`に対応するプロンプト生成関数を追加
4. `main.js`の`generatePrompt()`関数にケースを追加
5. `main.js`に対応するフォームデータ収集関数を追加

### フィールドタイプ

サポートされているフィールドタイプ：
- `text` - テキスト入力
- `textarea` - 複数行テキスト入力
- `select` - ドロップダウン選択
- `date` - 日付選択
- `checkbox-group` - チェックボックスグループ（複数選択可）

### 特殊な設定

- `isSpecial: true` - 通常のフォームではない特殊なタブ（フィードバックタブなど）
- `hasOtherInput: true` - チェックボックスオプションに「その他」入力フィールドを追加

## テスト

テストは`script.module.js`を通じて実行されます。このファイルは、新しいモジュール構造から関数をインポートして、既存のテストとの互換性を保っています。

```bash
npm test
```