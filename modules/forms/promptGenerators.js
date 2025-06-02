// promptGenerators.js - プロンプト生成関数モジュール

export function generateEmailPrompt(data) {
    // メールの主要な伝達事項を整形。空行や前後の空白を除去し、各行の先頭に "- " を付与。
    const formattedMainPoints = data.mainPoints
        .split('\n')
        .map(line => line.trim())
        .filter(line => line) // 空行を除去
        .map(line => `  - ${line}`)
        .join('\n');

    // 署名情報を整形。メールと同様の処理。
    const formattedSignature = data.signature
        .split('\n')
        .map(line => line.trim())
        .filter(line => line) // 空行を除去
        .map(line => `  ${line}`)
        .join('\n');

    return `
# 指示:
あなたはプロフェッショナルなビジネスメール作成アシスタントです。
以下の詳細情報に基づいて、ビジネスメールのタイトルと本文を作成してください。

# メール作成の詳細情報:

## 1. メールの基本情報
- **宛先:** ${data.toInfo}
- **メールの主な目的:** ${data.purpose}
- **送信者の立場・相手との関係性:** ${data.senderRelation}

## 2. メールの内容
- **主要な伝達事項 (箇条書きで具体的に):**
${formattedMainPoints || '  - (具体的な伝達事項なし)'}

## 3. メールのトーンと表現
- **希望するトーン:** ${data.tone}
- **含めたいキーワード (自然な形で使用):** ${data.keywords}

## 4. 期待するアクションと結び
- **相手に促したい行動:** ${data.callToAction}
- **署名:**
${formattedSignature || '  (署名情報なし)'}

# 出力形式の要件:
- 上記の情報を元に、自然で分かりやすい日本語のビジネスメールを作成してください。
- まず件名（タイトル）を提示し、その後にメール本文を作成してください。
- 敬語やビジネス表現を適切に使用してください。
- 箇条書きで指示された伝達事項は、自然な文章に組み込んでください。

---
上記指示に従って、メールのタイトルと本文を作成してください。
`;
}

export function generateSnsPrompt(data) {
    return `
# 指示:
あなたは[${data.platform}]の運用に長けたSNSマーケターです。
以下の情報に基づいて、魅力的でエンゲージメントを高めるSNS投稿を作成してください。

# SNS投稿作成の詳細情報:

- **利用SNSプラットフォーム:** ${data.platform}
- **投稿の目的:** ${data.purpose}
- **ターゲット層:** ${data.targetAudience}
- **最も伝えたいメッセージ:** ${data.mainMessage}
- **含めたいキーワード/ハッシュタグ候補:** ${data.keywordsHashtags}
- **希望する投稿の雰囲気・トーン:** ${data.tone}
- **コールトゥアクション (任意):** ${data.callToAction}
- **画像/動画の有無・簡単な説明 (任意):** ${data.imageVideoInfo}

# 出力形式の要件:
- 上記の情報を元に、ターゲット層に響くような投稿文を作成してください。
- 各SNSプラットフォームの特性（文字数制限など）を考慮してください（具体的な文字数調整はAIに任せます）。
- ハッシュタグは効果的に使用してください。
- 絵文字などを適度に使うと、より魅力的になります（AIの判断に任せます）。

---
上記指示に従って、SNS投稿を作成してください。
`;
}

export function generateBlogPrompt(data) {
    // ブログの構成案/見出し案を整形
    const formattedStructureOutline = data.structureOutline
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .map(line => `  - ${line}`)
        .join('\n');

    return `
# 指示:
あなたは[${data.targetReader}]向けのブログ記事を執筆する専門家です。
以下の情報に基づいて、読者の関心を引き付け、SEOにも配慮した質の高いブログ記事の構成案と導入部分を作成してください。

# ブログ記事作成の詳細情報:

- **記事のメイントピック/仮タイトル:** ${data.topicTitle}
- **ターゲット読者層:** ${data.targetReader}
- **読者が記事を読むことで得られるメリット/解決できる課題:** ${data.readerBenefit}
- **記事の主要な構成案/見出し案 (箇条書き推奨):**
${formattedStructureOutline || '  - (構成案なし)'}
- **必ず含めたいキーワード (SEO対策):** ${data.seoKeywords}
- **希望する文体・トーン:** ${data.styleTone}
- **参考資料/データ (任意):** ${data.referenceMaterial}
- **読者に促したい行動 (記事の最後など、任意):** ${data.callToAction}

# 出力形式の要件:
- まず、提案された構成案を元に、より魅力的なブログ記事の構成（見出しレベルを含む）を提示してください。
- 次に、その構成に基づいて、読者の興味を引く「はじめに」の部分（導入文）を作成してください。
- 全体を通して、指定されたキーワードを自然な形で盛り込み、SEOを意識してください。
- 文体とトーンは指定されたものを遵守してください。

---
上記指示に従って、ブログ記事の構成案と導入部分を作成してください。
`;
}

export function generateReportPrompt(data) {
    // 訪問報告書の各箇条書き項目を整形する共通関数
    const formatReportList = (text) => {
        return text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .map(line => `  - ${line}`)
            .join('\n');
    };

    const formattedDiscussionPoints = formatReportList(data.discussionPoints);
    const formattedDecisionsAgreements = formatReportList(data.decisionsAgreements);
    const formattedPendingIssues = formatReportList(data.pendingIssues);
    const formattedNextActions = formatReportList(data.nextActions);

    return `
# 指示:
あなたはビジネスにおける訪問内容を的確かつ簡潔にまとめる能力に長けたアシスタントです。
以下の情報に基づいて、訪問報告書を作成してください。

# 訪問報告書の詳細情報:

- **訪問日:** ${data.visitDate}
- **訪問先企業・部署・担当者名:** ${data.clientInfo}
- **自社訪問者:** ${data.ourAttendees}
- **訪問目的:** ${data.purpose}

## 協議内容と結果
- **主要な議題・協議内容:**
${formattedDiscussionPoints || '  - (具体的な議題なし)'}
- **決定事項・合意事項:**
${formattedDecisionsAgreements || '  - (特になし)'}
- **ペンディング事項・課題:**
${formattedPendingIssues || '  - (特になし)'}

## 今後のアクション
- **次回までのアクションプラン (担当者、期限含む):**
${formattedNextActions || '  - (特になし)'}

## 所感その他
- **所感・気づき:** ${data.impressionsNotes}
- **報告書を読む相手に特に伝えたいこと:** ${data.specialMention}

# 出力形式の要件:
- 上記の情報を元に、構造化された読みやすい訪問報告書を作成してください。
- 各項目は明確に区別し、箇条書きで整理されている部分はそのまま活かしてください。
- ビジネス文書として適切な言葉遣いをしてください。

---
上記指示に従って、訪問報告書を作成してください。
`;
}