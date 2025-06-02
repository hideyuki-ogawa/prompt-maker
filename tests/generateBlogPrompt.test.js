const { generateBlogPrompt } = require('../script.module.js');

describe('generateBlogPrompt', () => {
  test('必須項目が正しく含まれること', () => {
    const data = {
      topicTitle: 'AIツールを活用した業務効率化の方法',
      targetReader: '中小企業の経営者・管理職',
      readerBenefit: '業務時間を30%削減できる具体的な方法を学べる',
      structureOutline: '1. 導入\n2. AIツールの種類\n3. 導入事例\n4. 実践ステップ\n5. まとめ',
      seoKeywords: 'AI, 業務効率化, DX, 生産性向上',
      styleTone: '親しみやすく、実践的',
      referenceMaterial: '経済産業省のDXレポート2023',
      callToAction: '無料相談の申し込み'
    };

    const result = generateBlogPrompt(data);

    expect(result).toContain('AIツールを活用した業務効率化の方法');
    expect(result).toContain('中小企業の経営者・管理職');
    expect(result).toContain('業務時間を30%削減できる具体的な方法を学べる');
    expect(result).toContain('AI, 業務効率化, DX, 生産性向上');
    expect(result).toContain('親しみやすく、実践的');
    expect(result).toContain('経済産業省のDXレポート2023');
    expect(result).toContain('無料相談の申し込み');
  });

  test('データが空の場合でも、プロンプトが生成されること', () => {
    const data = {};
    const result = generateBlogPrompt(data);
    expect(result).toContain('# 指示:');
    expect(result).toContain('ブログ記事を執筆する専門家');
  });

  test('一部のデータのみ入力された場合、正しく処理されること', () => {
    const data = {
      topicTitle: 'リモートワークのコツ',
      targetReader: '在宅勤務初心者',
      readerBenefit: '',
      structureOutline: '',
      seoKeywords: '',
      styleTone: '',
      referenceMaterial: '',
      callToAction: ''
    };

    const result = generateBlogPrompt(data);

    expect(result).toContain('リモートワークのコツ');
    expect(result).toContain('在宅勤務初心者');
    expect(result).toContain('(構成案なし)');
  });

  test('プロンプトに指示文が含まれること', () => {
    const data = {
      topicTitle: 'テスト',
      targetReader: '',
      readerBenefit: '',
      structureOutline: '',
      seoKeywords: '',
      styleTone: '',
      referenceMaterial: '',
      callToAction: ''
    };

    const result = generateBlogPrompt(data);

    expect(result).toContain('以下の情報に基づいて、読者の関心を引き付け、SEOにも配慮した質の高いブログ記事の構成案と導入部分を作成してください');
    expect(result).toContain('より魅力的なブログ記事の構成（見出しレベルを含む）を提示してください');
    expect(result).toContain('読者の興味を引く「はじめに」の部分（導入文）を作成してください');
  });

  test('すべてのフィールドラベルが含まれること', () => {
    const data = {
      topicTitle: 'テスト',
      targetReader: '',
      readerBenefit: '',
      structureOutline: '',
      seoKeywords: '',
      styleTone: '',
      referenceMaterial: '',
      callToAction: ''
    };

    const result = generateBlogPrompt(data);

    expect(result).toContain('記事のメイントピック/仮タイトル:');
    expect(result).toContain('ターゲット読者層:');
    expect(result).toContain('読者が記事を読むことで得られるメリット/解決できる課題:');
    expect(result).toContain('記事の主要な構成案/見出し案');
    expect(result).toContain('必ず含めたいキーワード (SEO対策):');
    expect(result).toContain('希望する文体・トーン:');
    expect(result).toContain('参考資料/データ (任意):');
    expect(result).toContain('読者に促したい行動 (記事の最後など、任意):');
  });

  test('値がundefinedの場合も処理されること', () => {
    const data = {
      topicTitle: 'テストタイトル'
    };

    const result = generateBlogPrompt(data);

    expect(result).toContain('テストタイトル');
    // 値がundefinedの場合でもプロンプトが生成されることを確認
    expect(result).toContain('# 指示:');
  });

  test('複数行のテキストが正しく整形されること', () => {
    const data = {
      topicTitle: 'テスト記事',
      targetReader: '',
      readerBenefit: '',
      structureOutline: 'はじめに\nポイント1\nポイント2\nポイント3\nまとめ',
      seoKeywords: '',
      styleTone: '',
      referenceMaterial: '',
      callToAction: ''
    };
    
    const result = generateBlogPrompt(data);
    
    expect(result).toContain('- はじめに');
    expect(result).toContain('- ポイント1');
    expect(result).toContain('- ポイント2');
    expect(result).toContain('- ポイント3');
    expect(result).toContain('- まとめ');
  });
});