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
    expect(result).toContain('  - 1. 新製品の仕様説明');
    expect(result).toContain('  - 2. 導入スケジュール');
    expect(result).toContain('  - 3. 価格交渉');
    expect(result).toContain('6月中旬に試験導入開始で合意');
    expect(result).toContain('カスタマイズ要件の詳細確認');
    expect(result).toContain('詳細見積書を来週月曜日までに送付');
    expect(result).toContain('非常に前向きな反応。競合他社も検討中とのこと');
    expect(result).toContain('決裁者との面談を早期に設定する必要あり');
  });

  test('空のデータで正しく動作すること', () => {
    const data = {
      visitDate: '指定なし',
      clientInfo: '指定なし',
      ourAttendees: '指定なし',
      purpose: '指定なし',
      discussionPoints: '',
      decisionsAgreements: '',
      pendingIssues: '',
      nextActions: '',
      impressionsNotes: '指定なし',
      specialMention: '指定なし'
    };

    const result = generateReportPrompt(data);

    expect(result).toContain('指定なし');
    expect(result).toContain('(具体的な議題なし)');
    expect(result).toContain('(特になし)');
  });

  test('プロンプトに新しい指示文が含まれること', () => {
    const data = {
      visitDate: '2024年5月30日',
      clientInfo: 'テスト',
      ourAttendees: 'テスト',
      purpose: 'テスト',
      discussionPoints: 'テスト',
      decisionsAgreements: 'テスト',
      pendingIssues: 'テスト',
      nextActions: 'テスト',
      impressionsNotes: 'テスト',
      specialMention: 'テスト'
    };

    const result = generateReportPrompt(data);

    expect(result).toContain('# 指示:');
    expect(result).toContain('あなたはビジネスにおける訪問内容を的確かつ簡潔にまとめる能力に長けたアシスタントです。');
    expect(result).toContain('訪問報告書を作成してください。');
    expect(result).toContain('# 出力形式の要件:');
    expect(result).toContain('構造化された読みやすい訪問報告書を作成してください。');
  });

  test('すべてのセクションヘッダーが含まれること', () => {
    const data = {
      visitDate: '2024年5月30日',
      clientInfo: 'テスト',
      ourAttendees: 'テスト',
      purpose: 'テスト',
      discussionPoints: 'テスト',
      decisionsAgreements: 'テスト',
      pendingIssues: 'テスト',
      nextActions: 'テスト',
      impressionsNotes: 'テスト',
      specialMention: 'テスト'
    };

    const result = generateReportPrompt(data);

    expect(result).toContain('- **訪問日:**');
    expect(result).toContain('- **訪問先企業・部署・担当者名:**');
    expect(result).toContain('- **自社訪問者:**');
    expect(result).toContain('- **訪問目的:**');
    expect(result).toContain('## 協議内容と結果');
    expect(result).toContain('- **主要な議題・協議内容:**');
    expect(result).toContain('- **決定事項・合意事項:**');
    expect(result).toContain('- **ペンディング事項・課題:**');
    expect(result).toContain('## 今後のアクション');
    expect(result).toContain('- **次回までのアクションプラン (担当者、期限含む):**');
    expect(result).toContain('## 所感その他');
    expect(result).toContain('- **所感・気づき:**');
    expect(result).toContain('- **報告書を読む相手に特に伝えたいこと:**');
  });

  test('複数行のテキストが正しくフォーマットされること', () => {
    const data = {
      visitDate: '2024年5月30日',
      clientInfo: 'テスト',
      ourAttendees: 'テスト',
      purpose: 'テスト',
      discussionPoints: '製品デモンストレーション\n価格・条件交渉\n今後のスケジュール',
      decisionsAgreements: 'テスト',
      pendingIssues: 'テスト',
      nextActions: '見積書作成（営業部）\n技術仕様書の準備（技術部）\n契約書ドラフトの作成（法務部）',
      impressionsNotes: 'テスト',
      specialMention: 'テスト'
    };

    const result = generateReportPrompt(data);

    expect(result).toContain('  - 製品デモンストレーション');
    expect(result).toContain('  - 価格・条件交渉');
    expect(result).toContain('  - 今後のスケジュール');
    expect(result).toContain('  - 見積書作成（営業部）');
    expect(result).toContain('  - 技術仕様書の準備（技術部）');
    expect(result).toContain('  - 契約書ドラフトの作成（法務部）');
  });
});