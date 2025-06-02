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

  test('データが空の場合でも、プロンプトが生成されること', () => {
    const data = {};
    const result = generateSnsPrompt(data);
    expect(result).toContain('# 指示:');
    expect(result).toContain('SNSマーケター');
  });

  test('一部のデータのみ入力された場合、正しく処理されること', () => {
    const data = {
      platform: 'Instagram',
      mainMessage: '今日のランチ'
    };

    const result = generateSnsPrompt(data);

    expect(result).toContain('Instagram');
    expect(result).toContain('今日のランチ');
  });

  test('プロンプトに指示文が含まれること', () => {
    const data = {
      platform: 'テスト',
      purpose: '',
      targetAudience: '',
      mainMessage: '',
      keywordsHashtags: '',
      tone: '',
      callToAction: '',
      imageVideoInfo: ''
    };

    const result = generateSnsPrompt(data);

    expect(result).toContain('以下の情報に基づいて、魅力的でエンゲージメントを高めるSNS投稿を作成してください');
    expect(result).toContain('ターゲット層に響くような投稿文を作成してください');
    expect(result).toContain('各SNSプラットフォームの特性（文字数制限など）を考慮してください');
  });

  test('すべてのフィールドラベルが含まれること', () => {
    const data = {
      platform: 'テスト',
      purpose: '',
      targetAudience: '',
      mainMessage: '',
      keywordsHashtags: '',
      tone: '',
      callToAction: '',
      imageVideoInfo: ''
    };

    const result = generateSnsPrompt(data);

    expect(result).toContain('利用SNSプラットフォーム:');
    expect(result).toContain('投稿の目的:');
    expect(result).toContain('ターゲット層:');
    expect(result).toContain('最も伝えたいメッセージ:');
    expect(result).toContain('含めたいキーワード/ハッシュタグ候補:');
    expect(result).toContain('希望する投稿の雰囲気・トーン:');
    expect(result).toContain('コールトゥアクション (任意):');
    expect(result).toContain('画像/動画の有無・簡単な説明 (任意):');
  });

  test('値がundefinedの場合も処理されること', () => {
    const data = {
      platform: 'LinkedIn'
    };

    const result = generateSnsPrompt(data);

    expect(result).toContain('LinkedIn');
    expect(result).toContain('# 指示:');
  });

  test('異なるプラットフォームでも正しく動作すること', () => {
    const platforms = ['Twitter', 'Facebook', 'Instagram', 'LinkedIn', 'TikTok'];
    
    platforms.forEach(platform => {
      const data = { 
        platform,
        purpose: '',
        targetAudience: '',
        mainMessage: '',
        keywordsHashtags: '',
        tone: '',
        callToAction: '',
        imageVideoInfo: ''
      };
      const result = generateSnsPrompt(data);
      expect(result).toContain(platform);
    });
  });
});