const { generateReportPrompt } = require('../script.module.js');

describe('generateReportPrompt', () => {
  test('必須項目が正しく含まれること', () => {
    const data = {
      visitDate: '2024年5月30日',
      clientInfo: '株式会社ABC商事 営業部',
      ourAttendees: '山田太郎（営業部長）、鈴木花子（営業）',
      purpose: '新製品導入に関する打ち合わせ',
      discussionPoints: '1. 新製品の仕様説明\n2. 導入スケジュール\n3. 価格交渉',
      decisionsAgreements: '6月中旬に試験導入開始で合意',
      pendingIssues: 'カスタマイズ要件の詳細確認',
      nextActions: '詳細見積書を来週月曜日までに送付',
      impressionsNotes: '非常に前向きな反応。競合他社も検討中とのこと',
      specialMention: '決裁者との面談を早期に設定する必要あり'
    };

    const result = generateReportPrompt(data);

    expect(result).toContain('2024年5月30日');
    expect(result).toContain('株式会社ABC商事 営業部');
    expect(result).toContain('山田太郎（営業部長）、鈴木花子（営業）');
    expect(result).toContain('新製品導入に関する打ち合わせ');
    expect(result).toContain('- 1. 新製品の仕様説明');
    expect(result).toContain('- 2. 導入スケジュール');
    expect(result).toContain('- 3. 価格交渉');
    expect(result).toContain('6月中旬に試験導入開始で合意');
    expect(result).toContain('カスタマイズ要件の詳細確認');
    expect(result).toContain('詳細見積書を来週月曜日までに送付');
    expect(result).toContain('非常に前向きな反応。競合他社も検討中とのこと');
    expect(result).toContain('決裁者との面談を早期に設定する必要あり');
  });

  test('データが空の場合でも、プロンプトが生成されること', () => {
    const data = {};
    const result = generateReportPrompt(data);
    expect(result).toContain('# 指示:');
    expect(result).toContain('訪問内容を的確かつ簡潔にまとめる能力に長けたアシスタント');
  });

  test('一部のデータのみ入力された場合、正しく処理されること', () => {
    const data = {
      visitDate: '2024年5月30日',
      clientInfo: '株式会社テスト',
      ourAttendees: '',
      purpose: '定期訪問',
      discussionPoints: '',
      decisionsAgreements: '',
      pendingIssues: '',
      nextActions: '',
      impressionsNotes: '',
      specialMention: ''
    };

    const result = generateReportPrompt(data);

    expect(result).toContain('2024年5月30日');
    expect(result).toContain('株式会社テスト');
    expect(result).toContain('定期訪問');
    expect(result).toContain('(具体的な議題なし)');
    expect(result).toContain('(特になし)');
  });

  test('プロンプトに指示文が含まれること', () => {
    const data = {
      visitDate: '',
      clientInfo: '',
      ourAttendees: '',
      purpose: '',
      discussionPoints: '',
      decisionsAgreements: '',
      pendingIssues: '',
      nextActions: '',
      impressionsNotes: '',
      specialMention: ''
    };

    const result = generateReportPrompt(data);

    expect(result).toContain('以下の情報に基づいて、訪問報告書を作成してください');
    expect(result).toContain('構造化された読みやすい訪問報告書を作成してください');
    expect(result).toContain('ビジネス文書として適切な言葉遣いをしてください');
  });

  test('すべてのフィールドラベルが含まれること', () => {
    const data = {
      visitDate: '',
      clientInfo: '',
      ourAttendees: '',
      purpose: '',
      discussionPoints: '',
      decisionsAgreements: '',
      pendingIssues: '',
      nextActions: '',
      impressionsNotes: '',
      specialMention: ''
    };

    const result = generateReportPrompt(data);

    expect(result).toContain('訪問日:');
    expect(result).toContain('訪問先企業・部署・担当者名:');
    expect(result).toContain('自社訪問者:');
    expect(result).toContain('訪問目的:');
    expect(result).toContain('主要な議題・協議内容:');
    expect(result).toContain('決定事項・合意事項:');
    expect(result).toContain('ペンディング事項・課題:');
    expect(result).toContain('次回までのアクションプラン');
    expect(result).toContain('所感・気づき:');
    expect(result).toContain('報告書を読む相手に特に伝えたいこと:');
  });

  test('値がundefinedの場合も処理されること', () => {
    const data = {
      visitDate: '2024年5月30日',
      clientInfo: 'テスト会社'
    };

    const result = generateReportPrompt(data);

    expect(result).toContain('2024年5月30日');
    expect(result).toContain('テスト会社');
    // 値がundefinedの場合でもプロンプトが生成されることを確認
    expect(result).toContain('# 指示:');
  });

  test('複数行のテキストが正しく整形されること', () => {
    const data = {
      visitDate: '',
      clientInfo: '',
      ourAttendees: '',
      purpose: '',
      discussionPoints: 'Aの件について\nBの確認\nCの提案',
      decisionsAgreements: '次回ミーティング日程\n予算の承認',
      pendingIssues: '技術的な検証\n法務確認',
      nextActions: '資料作成（田中）\n見積もり提出（鈴木）',
      impressionsNotes: '',
      specialMention: ''
    };

    const result = generateReportPrompt(data);

    expect(result).toContain('- Aの件について');
    expect(result).toContain('- Bの確認');
    expect(result).toContain('- Cの提案');
    expect(result).toContain('- 次回ミーティング日程');
    expect(result).toContain('- 予算の承認');
    expect(result).toContain('- 技術的な検証');
    expect(result).toContain('- 法務確認');
    expect(result).toContain('- 資料作成（田中）');
    expect(result).toContain('- 見積もり提出（鈴木）');
  });
});