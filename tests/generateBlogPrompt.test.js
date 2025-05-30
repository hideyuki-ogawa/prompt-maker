const { generateBlogPrompt } = require('../script.module.js');

describe('generateBlogPrompt', () => {
  test('必須項目が正しく含まれること', () => {
    const data = {
      topicTitle: 'AIツールを活用した業務効率化の方法',
      targetReader: '中小企業の経営者・管理職',
      readerBenefit: '業務時間を30%削減できる具体的な方法を学べる',
      structureOutline: '1. 導入 2. AIツールの種類 3. 導入事例 4. 実践ステップ 5. まとめ',
      seoKeywords: 'AI, 業務効率化, DX, 生産性向上',
      styleTone: '親しみやすく、実践的',
      referenceMaterial: '経済産業省のDXレポート2023',
      callToAction: '無料相談の申し込み'
    };

    const result = generateBlogPrompt(data);

    expect(result).toContain('AIツールを活用した業務効率化の方法');
    expect(result).toContain('中小企業の経営者・管理職');
    expect(result).toContain('業務時間を30%削減できる具体的な方法を学べる');
    expect(result).toContain('1. 導入 2. AIツールの種類 3. 導入事例 4. 実践ステップ 5. まとめ');
    expect(result).toContain('AI, 業務効率化, DX, 生産性向上');
    expect(result).toContain('親しみやすく、実践的');
    expect(result).toContain('経済産業省のDXレポート2023');
    expect(result).toContain('無料相談の申し込み');
  });

  test('データが空の場合、デフォルトメッセージが返されること', () => {
    const data = {};
    const result = generateBlogPrompt(data);
    expect(result).toBe('ブログ記事の情報を入力してください。');
  });

  test('一部のデータのみ入力された場合、正しく処理されること', () => {
    const data = {
      topicTitle: 'リモートワークのコツ',
      targetReader: '在宅勤務初心者'
    };

    const result = generateBlogPrompt(data);

    expect(result).toContain('リモートワークのコツ');
    expect(result).toContain('在宅勤務初心者');
    expect(result).toContain('（未記入）');
  });

  test('プロンプトに指示文が含まれること', () => {
    const data = {
      topicTitle: 'テスト'
    };

    const result = generateBlogPrompt(data);

    expect(result).toContain('以下の情報に基づいて、魅力的なブログ記事を作成してください');
    expect(result).toContain('読者を引き付け、最後まで読んでもらえる価値のあるブログ記事を作成してください');
    expect(result).toContain('見出しや段落構成も含めて提案してください');
  });

  test('すべてのフィールドラベルが含まれること', () => {
    const data = {
      topicTitle: 'テスト'
    };

    const result = generateBlogPrompt(data);

    expect(result).toContain('【トピック/タイトル】');
    expect(result).toContain('【ターゲット読者】');
    expect(result).toContain('【読者が得られる価値・ベネフィット】');
    expect(result).toContain('【記事の構成案】');
    expect(result).toContain('【SEOキーワード】');
    expect(result).toContain('【文体・トーン】');
    expect(result).toContain('【参考資料・データ】');
    expect(result).toContain('【読者に促したい行動】');
  });

  test('nullやundefinedの値が正しく処理されること', () => {
    const data = {
      topicTitle: 'テストタイトル',
      targetReader: null,
      readerBenefit: undefined,
      structureOutline: ''
    };

    const result = generateBlogPrompt(data);

    expect(result).toContain('テストタイトル');
    expect(result.match(/（未記入）/g).length).toBeGreaterThan(0);
  });

  test('長い構成案でも正しく処理されること', () => {
    const data = {
      topicTitle: 'テスト',
      structureOutline: `
        1. はじめに - なぜ今AIが重要なのか
        2. AIの基礎知識 - 機械学習とディープラーニング
        3. ビジネスへの応用事例
           - 製造業での品質管理
           - 小売業での需要予測
           - 金融業でのリスク管理
        4. 導入の課題と解決策
        5. 今後の展望
        6. まとめとアクションプラン
      `
    };

    const result = generateBlogPrompt(data);

    expect(result).toContain(data.structureOutline);
  });
});