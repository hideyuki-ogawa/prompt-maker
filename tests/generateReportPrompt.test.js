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
    expect(result).toContain('1. 新製品の仕様説明\n2. 導入スケジュール\n3. 価格交渉');
    expect(result).toContain('6月中旬に試験導入開始で合意');
    expect(result).toContain('カスタマイズ要件の詳細確認');
    expect(result).toContain('詳細見積書を来週月曜日までに送付');
    expect(result).toContain('非常に前向きな反応。競合他社も検討中とのこと');
    expect(result).toContain('決裁者との面談を早期に設定する必要あり');
  });

  test('データが空の場合、デフォルトメッセージが返されること', () => {
    const data = {};
    const result = generateReportPrompt(data);
    expect(result).toBe('訪問レポートの情報を入力してください。');
  });

  test('一部のデータのみ入力された場合、正しく処理されること', () => {
    const data = {
      visitDate: '2024年5月30日',
      clientInfo: '株式会社テスト',
      purpose: '定期訪問'
    };

    const result = generateReportPrompt(data);

    expect(result).toContain('2024年5月30日');
    expect(result).toContain('株式会社テスト');
    expect(result).toContain('定期訪問');
    expect(result).toContain('（未記入）');
  });

  test('プロンプトに指示文が含まれること', () => {
    const data = {
      visitDate: 'テスト'
    };

    const result = generateReportPrompt(data);

    expect(result).toContain('以下の情報に基づいて、明確で簡潔な訪問レポートを作成してください');
    expect(result).toContain('関係者が素早く理解できるよう構造化された訪問レポートを作成してください');
    expect(result).toContain('重要なポイントは強調し、次のアクションが明確になるようにしてください');
  });

  test('すべてのフィールドラベルが含まれること', () => {
    const data = {
      visitDate: 'テスト'
    };

    const result = generateReportPrompt(data);

    expect(result).toContain('【訪問日】');
    expect(result).toContain('【訪問先情報】');
    expect(result).toContain('【自社訪問者】');
    expect(result).toContain('【訪問目的】');
    expect(result).toContain('【議題・協議内容】');
    expect(result).toContain('【決定事項・合意内容】');
    expect(result).toContain('【ペンディング事項】');
    expect(result).toContain('【次回までのアクション】');
    expect(result).toContain('【所感・気づき】');
    expect(result).toContain('【特に伝えたいこと】');
  });

  test('nullやundefinedの値が正しく処理されること', () => {
    const data = {
      visitDate: '2024年5月30日',
      clientInfo: null,
      ourAttendees: undefined,
      purpose: ''
    };

    const result = generateReportPrompt(data);

    expect(result).toContain('2024年5月30日');
    expect(result.match(/（未記入）/g).length).toBeGreaterThan(0);
  });

  test('複数行のテキストが正しく処理されること', () => {
    const data = {
      visitDate: '2024年5月30日',
      discussionPoints: `
        1. 製品デモンストレーション
           - 基本機能の説明
           - カスタマイズオプション
        2. 価格・条件交渉
           - ボリュームディスカウント
           - 支払い条件
        3. 今後のスケジュール
      `,
      nextActions: `
        ・見積書作成（営業部）
        ・技術仕様書の準備（技術部）
        ・契約書ドラフトの作成（法務部）
      `
    };

    const result = generateReportPrompt(data);

    expect(result).toContain(data.discussionPoints);
    expect(result).toContain(data.nextActions);
  });
});