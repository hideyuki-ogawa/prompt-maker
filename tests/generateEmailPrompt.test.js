const { generateEmailPrompt } = require('../script.module.js');

describe('generateEmailPrompt', () => {
  test('必須項目が正しく含まれること', () => {
    const data = { 
      purpose: 'アポイント依頼',
      toInfo: '株式会社テスト 営業部 田中様',
      senderRelation: '新規取引先',
      mainPoints: '新商品のご提案',
      tone: 'フォーマル',
      keywords: '新商品, 効率化',
      callToAction: '会議の日程調整',
      signature: '山田太郎'
    };
    
    const result = generateEmailPrompt(data);
    
    expect(result).toContain('アポイント依頼');
    expect(result).toContain('株式会社テスト 営業部 田中様');
    expect(result).toContain('新規取引先');
    expect(result).toContain('新商品のご提案');
    expect(result).toContain('フォーマル');
    expect(result).toContain('新商品, 効率化');
    expect(result).toContain('会議の日程調整');
    expect(result).toContain('山田太郎');
  });

  test('データが空の場合、デフォルトメッセージが返されること', () => {
    const data = {};
    const result = generateEmailPrompt(data);
    expect(result).toBe('メールの情報を入力してください。');
  });

  test('一部のデータのみ入力された場合、正しく処理されること', () => {
    const data = {
      purpose: '週次報告',
      toInfo: '上司'
    };
    
    const result = generateEmailPrompt(data);
    
    expect(result).toContain('週次報告');
    expect(result).toContain('上司');
    expect(result).toContain('（未記入）');
  });

  test('プロンプトに指示文が含まれること', () => {
    const data = {
      purpose: 'テスト'
    };
    
    const result = generateEmailPrompt(data);
    
    expect(result).toContain('以下の情報に基づいて、プロフェッショナルなビジネスメールを作成してください');
    expect(result).toContain('適切な敬語を使い、要点が明確に伝わるメールを作成してください');
    expect(result).toContain('件名も含めて提案してください');
  });

  test('すべてのフィールドラベルが含まれること', () => {
    const data = {
      purpose: 'テスト'
    };
    
    const result = generateEmailPrompt(data);
    
    expect(result).toContain('【メールの目的】');
    expect(result).toContain('【宛先情報】');
    expect(result).toContain('【送信者の立場・関係性】');
    expect(result).toContain('【主要な伝達事項】');
    expect(result).toContain('【トーン】');
    expect(result).toContain('【含めたいキーワード】');
    expect(result).toContain('【相手に促したい行動】');
    expect(result).toContain('【署名】');
  });

  test('nullやundefinedの値が正しく処理されること', () => {
    const data = {
      purpose: 'テスト',
      toInfo: null,
      senderRelation: undefined,
      mainPoints: ''
    };
    
    const result = generateEmailPrompt(data);
    
    expect(result).toContain('テスト');
    expect(result.match(/（未記入）/g).length).toBeGreaterThan(0);
  });
});