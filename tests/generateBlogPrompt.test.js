const { generateBlogPrompt } = require('../script.module.js');

describe('generateBlogPrompt', () => {
  test('必須項目が正しく含まれること', () => {
    const data = {
      topicTitle: 'AIツールを活用した業務効率化の方法',
      targetReader: '中小企業の経営者・管理職',
      readerBenefit: '業務時間を30%削減できる具体的な方法を学べる',
      structureOutline: '1. 導入\n2. AIツールの種類\n3. 導入事例\n4. 実践ステップ\n5. まとめ',
      seoKeywords: 'AI, 業務効率化, DX, 生産性向上',
      styleTone: '解説調',
      referenceMaterial: '経済産業省のDXレポート2023',
      callToAction: '無料相談の申し込み'
    };

    const result = generateBlogPrompt(data);

    expect(result).toContain('AIツールを活用した業務効率化の方法');
    expect(result).toContain('中小企業の経営者・管理職');
    expect(result).toContain('業務時間を30%削減できる具体的な方法を学べる');
    expect(result).toContain('  - 1. 導入');
    expect(result).toContain('  - 2. AIツールの種類');
    expect(result).toContain('AI, 業務効率化, DX, 生産性向上');
    expect(result).toContain('解説調');
    expect(result).toContain('経済産業省のDXレポート2023');
    expect(result).toContain('無料相談の申し込み');
  });

  test('空のデータで正しく動作すること', () => {
    const data = {
      topicTitle: '指定なし',
      targetReader: '指定なし',
      readerBenefit: '指定なし',
      structureOutline: '',
      seoKeywords: '特になし',
      styleTone: '解説調',
      referenceMaterial: '特になし',
      callToAction: '特になし'
    };

    const result = generateBlogPrompt(data);

    expect(result).toContain('指定なし');
    expect(result).toContain('特になし');
    expect(result).toContain('(構成案なし)');
  });

  test('プロンプトに新しい指示文が含まれること', () => {
    const data = {
      topicTitle: 'テスト',
      targetReader: 'テスト読者',
      readerBenefit: 'テスト',
      structureOutline: 'テスト',
      seoKeywords: 'テスト',
      styleTone: '専門的',
      referenceMaterial: 'テスト',
      callToAction: 'テスト'
    };

    const result = generateBlogPrompt(data);

    expect(result).toContain('# 指示:');
    expect(result).toContain('あなたは[テスト読者]向けのブログ記事を執筆する専門家です。');
    expect(result).toContain('読者の関心を引き付け、SEOにも配慮した質の高いブログ記事の構成案と導入部分を作成してください。');
    expect(result).toContain('# 出力形式の要件:');
    expect(result).toContain('まず、提案された構成案を元に、より魅力的なブログ記事の構成（見出しレベルを含む）を提示してください。');
  });

  test('すべてのフィールドラベルが含まれること', () => {
    const data = {
      topicTitle: 'テスト',
      targetReader: 'テスト',
      readerBenefit: 'テスト',
      structureOutline: 'テスト',
      seoKeywords: 'テスト',
      styleTone: 'フレンドリー',
      referenceMaterial: 'テスト',
      callToAction: 'テスト'
    };

    const result = generateBlogPrompt(data);

    expect(result).toContain('- **記事のメイントピック/仮タイトル:**');
    expect(result).toContain('- **ターゲット読者層:**');
    expect(result).toContain('- **読者が記事を読むことで得られるメリット/解決できる課題:**');
    expect(result).toContain('- **記事の主要な構成案/見出し案 (箇条書き推奨):**');
    expect(result).toContain('- **必ず含めたいキーワード (SEO対策):**');
    expect(result).toContain('- **希望する文体・トーン:**');
    expect(result).toContain('- **参考資料/データ (任意):**');
    expect(result).toContain('- **読者に促したい行動 (記事の最後など、任意):**');
  });

  test('複数行の構成案が正しくフォーマットされること', () => {
    const data = {
      topicTitle: 'テスト',
      targetReader: 'テスト',
      readerBenefit: 'テスト',
      structureOutline: 'はじめに - なぜ今AIが重要なのか\nAIの基礎知識\nビジネスへの応用事例\n導入の課題と解決策\nまとめ',
      seoKeywords: 'テスト',
      styleTone: '事例紹介',
      referenceMaterial: 'テスト',
      callToAction: 'テスト'
    };

    const result = generateBlogPrompt(data);

    expect(result).toContain('  - はじめに - なぜ今AIが重要なのか');
    expect(result).toContain('  - AIの基礎知識');
    expect(result).toContain('  - ビジネスへの応用事例');
    expect(result).toContain('  - 導入の課題と解決策');
    expect(result).toContain('  - まとめ');
  });
});