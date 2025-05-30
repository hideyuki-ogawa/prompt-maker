const { generateSnsPrompt } = require('../script.module.js');

describe('generateSnsPrompt', () => {
  test('必須項目が正しく含まれること', () => {
    const data = {
      platform: 'Twitter',
      purpose: '新商品の宣伝',
      targetAudience: '20-30代のビジネスパーソン',
      mainMessage: 'AI搭載の新しいプロダクティビティツール',
      keywordsHashtags: '#AI #生産性向上 #新商品',
      tone: 'カジュアルだが専門的',
      callToAction: 'ウェブサイトを訪問',
      imageVideoInfo: 'プロダクトのスクリーンショット3枚'
    };

    const result = generateSnsPrompt(data);

    expect(result).toContain('Twitter');
    expect(result).toContain('新商品の宣伝');
    expect(result).toContain('20-30代のビジネスパーソン');
    expect(result).toContain('AI搭載の新しいプロダクティビティツール');
    expect(result).toContain('#AI #生産性向上 #新商品');
    expect(result).toContain('カジュアルだが専門的');
    expect(result).toContain('ウェブサイトを訪問');
    expect(result).toContain('プロダクトのスクリーンショット3枚');
  });

  test('データが空の場合、デフォルトメッセージが返されること', () => {
    const data = {};
    const result = generateSnsPrompt(data);
    expect(result).toBe('SNS投稿の情報を入力してください。');
  });

  test('一部のデータのみ入力された場合、正しく処理されること', () => {
    const data = {
      platform: 'Instagram',
      mainMessage: '今日のランチ'
    };

    const result = generateSnsPrompt(data);

    expect(result).toContain('Instagram');
    expect(result).toContain('今日のランチ');
    expect(result).toContain('（未記入）');
  });

  test('プロンプトに指示文が含まれること', () => {
    const data = {
      platform: 'テスト'
    };

    const result = generateSnsPrompt(data);

    expect(result).toContain('以下の情報に基づいて、効果的なSNS投稿を作成してください');
    expect(result).toContain('エンゲージメントを高める魅力的な投稿を作成してください');
    expect(result).toContain('文字数制限も考慮してください');
  });

  test('すべてのフィールドラベルが含まれること', () => {
    const data = {
      platform: 'テスト'
    };

    const result = generateSnsPrompt(data);

    expect(result).toContain('【SNSプラットフォーム】');
    expect(result).toContain('【投稿の目的】');
    expect(result).toContain('【ターゲット層】');
    expect(result).toContain('【メインメッセージ】');
    expect(result).toContain('【キーワード/ハッシュタグ】');
    expect(result).toContain('【トーン】');
    expect(result).toContain('【コールトゥアクション】');
    expect(result).toContain('【画像/動画情報】');
  });

  test('nullやundefinedの値が正しく処理されること', () => {
    const data = {
      platform: 'LinkedIn',
      purpose: null,
      targetAudience: undefined,
      mainMessage: ''
    };

    const result = generateSnsPrompt(data);

    expect(result).toContain('LinkedIn');
    expect(result.match(/（未記入）/g).length).toBeGreaterThan(0);
  });

  test('異なるプラットフォームでも正しく動作すること', () => {
    const platforms = ['Twitter', 'Facebook', 'Instagram', 'LinkedIn', 'TikTok'];
    
    platforms.forEach(platform => {
      const data = { platform };
      const result = generateSnsPrompt(data);
      expect(result).toContain(platform);
    });
  });
});