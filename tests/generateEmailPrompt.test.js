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
      lengthLimit: '500文字以内',
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
    expect(result).toContain('500文字以内');
    expect(result).toContain('山田太郎');
  });

  test('複数行の伝達事項が正しくフォーマットされること', () => {
    const data = {
      purpose: 'テスト',
      toInfo: 'テスト宛先',
      senderRelation: 'テスト関係',
      mainPoints: '項目1\n項目2\n項目3',
      tone: 'フォーマル',
      keywords: 'テスト',
      callToAction: 'テスト',
      lengthLimit: '特になし',
      signature: 'テスト署名\n部署名'
    };
    
    const result = generateEmailPrompt(data);
    
    expect(result).toContain('  - 項目1');
    expect(result).toContain('  - 項目2');
    expect(result).toContain('  - 項目3');
    expect(result).toContain('  テスト署名');
    expect(result).toContain('  部署名');
  });

  test('空の値が適切に処理されること', () => {
    const data = {
      purpose: '週次報告',
      toInfo: '上司',
      senderRelation: '指定なし',
      mainPoints: '',
      tone: 'フォーマル',
      keywords: '特になし',
      callToAction: '特になし',
      lengthLimit: '特になし',
      signature: ''
    };
    
    const result = generateEmailPrompt(data);
    
    expect(result).toContain('週次報告');
    expect(result).toContain('上司');
    expect(result).toContain('指定なし');
    expect(result).toContain('特になし');
    expect(result).toContain('(具体的な伝達事項なし)');
    expect(result).toContain('(署名情報なし)');
  });

  test('プロンプトに新しい指示文が含まれること', () => {
    const data = {
      purpose: 'テスト',
      toInfo: 'テスト',
      senderRelation: 'テスト',
      mainPoints: 'テスト',
      tone: 'フォーマル',
      keywords: 'テスト',
      callToAction: 'テスト',
      lengthLimit: '特になし',
      signature: 'テスト'
    };
    
    const result = generateEmailPrompt(data);
    
    expect(result).toContain('# 指示:');
    expect(result).toContain('あなたはプロフェッショナルなビジネスメール作成アシスタントです。');
    expect(result).toContain('ビジネスメールのタイトルと本文を作成してください。');
    expect(result).toContain('# 出力形式の要件:');
    expect(result).toContain('まず件名（タイトル）を提示し、その後にメール本文を作成してください。');
  });

  test('すべてのセクションヘッダーが含まれること', () => {
    const data = {
      purpose: 'テスト',
      toInfo: 'テスト',
      senderRelation: 'テスト',
      mainPoints: 'テスト',
      tone: 'フォーマル',
      keywords: 'テスト',
      callToAction: 'テスト',
      lengthLimit: '特になし',
      signature: 'テスト'
    };
    
    const result = generateEmailPrompt(data);
    
    expect(result).toContain('## 1. メールの基本情報');
    expect(result).toContain('## 2. メールの内容');
    expect(result).toContain('## 3. メールのトーンと表現');
    expect(result).toContain('## 4. 期待するアクションと結び');
    expect(result).toContain('## 5. 文字数制限');
    expect(result).toContain('- **宛先:**');
    expect(result).toContain('- **メールの主な目的:**');
    expect(result).toContain('- **送信者の立場・相手との関係性:**');
    expect(result).toContain('- **希望するトーン:**');
    expect(result).toContain('- **文字数制限:**');
  });

  test('文字数制限が出力要件に反映されること', () => {
    const data = {
      purpose: 'テスト',
      toInfo: 'テスト',
      senderRelation: 'テスト',
      mainPoints: 'テスト',
      tone: 'フォーマル',
      keywords: 'テスト',
      callToAction: 'テスト',
      lengthLimit: '300文字以内',
      signature: 'テスト'
    };
    
    const result = generateEmailPrompt(data);
    
    expect(result).toContain('300文字以内');
    expect(result).toContain('文字数制限が指定されている場合は、その制限内で簡潔にまとめてください。');
  });
});