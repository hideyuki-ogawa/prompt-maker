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

  test('データが空の場合でも、プロンプトが生成されること', () => {
    const data = {};
    const result = generateEmailPrompt(data);
    expect(result).toContain('# 指示:');
    expect(result).toContain('ビジネスメール作成アシスタント');
  });

  test('一部のデータのみ入力された場合、正しく処理されること', () => {
    const data = {
      purpose: '週次報告',
      toInfo: '上司',
      mainPoints: '',
      signature: ''
    };
    
    const result = generateEmailPrompt(data);
    
    expect(result).toContain('週次報告');
    expect(result).toContain('上司');
    expect(result).toContain('(具体的な伝達事項なし)');
    expect(result).toContain('(署名情報なし)');
  });

  test('プロンプトに指示文が含まれること', () => {
    const data = {
      purpose: 'テスト',
      toInfo: '',
      senderRelation: '',
      mainPoints: '',
      tone: '',
      keywords: '',
      callToAction: '',
      signature: ''
    };
    
    const result = generateEmailPrompt(data);
    
    expect(result).toContain('以下の詳細情報に基づいて、ビジネスメールの本文を作成してください');
    expect(result).toContain('敬語やビジネス表現を適切に使用してください');
    expect(result).toContain('件名は含めず、メール本文のみを生成してください');
  });

  test('すべてのフィールドラベルが含まれること', () => {
    const data = {
      purpose: 'テスト',
      toInfo: '',
      senderRelation: '',
      mainPoints: '',
      tone: '',
      keywords: '',
      callToAction: '',
      signature: ''
    };
    
    const result = generateEmailPrompt(data);
    
    expect(result).toContain('メールの主な目的:');
    expect(result).toContain('宛先:');
    expect(result).toContain('送信者の立場・相手との関係性:');
    expect(result).toContain('主要な伝達事項');
    expect(result).toContain('希望するトーン:');
    expect(result).toContain('含めたいキーワード');
    expect(result).toContain('相手に促したい行動:');
    expect(result).toContain('署名:');
  });

  test('複数行のテキストが正しく整形されること', () => {
    const data = {
      purpose: 'テスト',
      toInfo: '',
      senderRelation: '',
      mainPoints: '項目1\n項目2\n項目3',
      tone: '',
      keywords: '',
      callToAction: '',
      signature: '会社名\n部署名\n氏名'
    };
    
    const result = generateEmailPrompt(data);
    
    expect(result).toContain('- 項目1');
    expect(result).toContain('- 項目2');
    expect(result).toContain('- 項目3');
    expect(result).toContain('会社名');
    expect(result).toContain('部署名');
    expect(result).toContain('氏名');
  });
});