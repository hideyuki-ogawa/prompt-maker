const { generateSnsPrompt } = require('../script.module.js');

describe('generateSnsPrompt', () => {
  test('必須項目が正しく含まれること', () => {
    const data = {
      platform: 'X (旧Twitter)',
      purpose: '新商品の宣伝',
      targetAudience: '20-30代のビジネスパーソン',
      mainMessage: 'AI搭載の新しいプロダクティビティツール',
      keywordsHashtags: '#AI #生産性向上 #新商品',
      tone: '親しみやすい',
      callToAction: 'ウェブサイトを訪問',
      imageVideoInfo: 'プロダクトのスクリーンショット3枚'
    };

    const result = generateSnsPrompt(data);

    expect(result).toContain('X (旧Twitter)');
    expect(result).toContain('新商品の宣伝');
    expect(result).toContain('20-30代のビジネスパーソン');
    expect(result).toContain('AI搭載の新しいプロダクティビティツール');
    expect(result).toContain('#AI #生産性向上 #新商品');
    expect(result).toContain('親しみやすい');
    expect(result).toContain('ウェブサイトを訪問');
    expect(result).toContain('プロダクトのスクリーンショット3枚');
  });

  test('空のデータで正しく動作すること', () => {
    const data = {
      platform: 'Instagram',
      purpose: '指定なし',
      targetAudience: '指定なし',
      mainMessage: '指定なし',
      keywordsHashtags: '特になし',
      tone: '親しみやすい',
      callToAction: '特になし',
      imageVideoInfo: '特になし'
    };
    
    const result = generateSnsPrompt(data);
    
    expect(result).toContain('Instagram');
    expect(result).toContain('指定なし');
    expect(result).toContain('特になし');
  });

  test('プロンプトに新しい指示文が含まれること', () => {
    const data = {
      platform: 'Facebook',
      purpose: 'テスト',
      targetAudience: 'テスト',
      mainMessage: 'テスト',
      keywordsHashtags: 'テスト',
      tone: '専門的',
      callToAction: 'テスト',
      imageVideoInfo: 'テスト'
    };

    const result = generateSnsPrompt(data);

    expect(result).toContain('# 指示:');
    expect(result).toContain('あなたは[Facebook]の運用に長けたSNSマーケターです。');
    expect(result).toContain('魅力的でエンゲージメントを高めるSNS投稿を作成してください。');
    expect(result).toContain('# 出力形式の要件:');
    expect(result).toContain('各SNSプラットフォームの特性（文字数制限など）を考慮してください');
  });

  test('すべてのフィールドラベルが含まれること', () => {
    const data = {
      platform: 'LinkedIn',
      purpose: 'テスト',
      targetAudience: 'テスト',
      mainMessage: 'テスト',
      keywordsHashtags: 'テスト',
      tone: '情報提供重視',
      callToAction: 'テスト',
      imageVideoInfo: 'テスト'
    };

    const result = generateSnsPrompt(data);

    expect(result).toContain('- **利用SNSプラットフォーム:**');
    expect(result).toContain('- **投稿の目的:**');
    expect(result).toContain('- **ターゲット層:**');
    expect(result).toContain('- **最も伝えたいメッセージ:**');
    expect(result).toContain('- **含めたいキーワード/ハッシュタグ候補:**');
    expect(result).toContain('- **希望する投稿の雰囲気・トーン:**');
    expect(result).toContain('- **コールトゥアクション (任意):**');
    expect(result).toContain('- **画像/動画の有無・簡単な説明 (任意):**');
  });

  test('異なるプラットフォームでも正しく動作すること', () => {
    const platforms = ['X (旧Twitter)', 'Facebook', 'Instagram', 'LinkedIn', 'TikTok'];
    
    platforms.forEach(platform => {
      const data = { 
        platform,
        purpose: 'テスト',
        targetAudience: 'テスト',
        mainMessage: 'テスト',
        keywordsHashtags: 'テスト',
        tone: '親しみやすい',
        callToAction: 'テスト',
        imageVideoInfo: 'テスト'
      };
      const result = generateSnsPrompt(data);
      expect(result).toContain(platform);
    });
  });
});