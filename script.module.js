// プロンプト生成関数をモジュールとしてエクスポート
// テスト用にscript.jsから関数を抽出

// メールプロンプト生成関数
function generateEmailPrompt(data) {
    const hasAllData = data.purpose || data.toInfo || data.senderRelation || data.mainPoints || 
                      data.tone || data.keywords || data.callToAction || data.signature;
    
    if (!hasAllData) {
        return 'メールの情報を入力してください。';
    }

    return `以下の情報に基づいて、プロフェッショナルなビジネスメールを作成してください：

【メールの目的】
${data.purpose || '（未記入）'}

【宛先情報】
${data.toInfo || '（未記入）'}

【送信者の立場・関係性】
${data.senderRelation || '（未記入）'}

【主要な伝達事項】
${data.mainPoints || '（未記入）'}

【トーン】
${data.tone || '（未記入）'}

【含めたいキーワード】
${data.keywords || '（未記入）'}

【相手に促したい行動】
${data.callToAction || '（未記入）'}

【署名】
${data.signature || '（未記入）'}

上記を踏まえて、適切な敬語を使い、要点が明確に伝わるメールを作成してください。件名も含めて提案してください。`;
}

// SNSプロンプト生成関数
function generateSnsPrompt(data) {
    const hasAllData = data.platform || data.purpose || data.targetAudience || data.mainMessage || 
                      data.keywordsHashtags || data.tone || data.callToAction || data.imageVideoInfo;
    
    if (!hasAllData) {
        return 'SNS投稿の情報を入力してください。';
    }

    return `以下の情報に基づいて、効果的なSNS投稿を作成してください：

【SNSプラットフォーム】
${data.platform || '（未記入）'}

【投稿の目的】
${data.purpose || '（未記入）'}

【ターゲット層】
${data.targetAudience || '（未記入）'}

【メインメッセージ】
${data.mainMessage || '（未記入）'}

【キーワード/ハッシュタグ】
${data.keywordsHashtags || '（未記入）'}

【トーン】
${data.tone || '（未記入）'}

【コールトゥアクション】
${data.callToAction || '（未記入）'}

【画像/動画情報】
${data.imageVideoInfo || '（未記入）'}

上記を踏まえて、エンゲージメントを高める魅力的な投稿を作成してください。文字数制限も考慮してください。`;
}

// ブログプロンプト生成関数
function generateBlogPrompt(data) {
    const hasAllData = data.topicTitle || data.targetReader || data.readerBenefit || data.structureOutline || 
                      data.seoKeywords || data.styleTone || data.referenceMaterial || data.callToAction;
    
    if (!hasAllData) {
        return 'ブログ記事の情報を入力してください。';
    }

    return `以下の情報に基づいて、魅力的なブログ記事を作成してください：

【トピック/タイトル】
${data.topicTitle || '（未記入）'}

【ターゲット読者】
${data.targetReader || '（未記入）'}

【読者が得られる価値・ベネフィット】
${data.readerBenefit || '（未記入）'}

【記事の構成案】
${data.structureOutline || '（未記入）'}

【SEOキーワード】
${data.seoKeywords || '（未記入）'}

【文体・トーン】
${data.styleTone || '（未記入）'}

【参考資料・データ】
${data.referenceMaterial || '（未記入）'}

【読者に促したい行動】
${data.callToAction || '（未記入）'}

上記を踏まえて、読者を引き付け、最後まで読んでもらえる価値のあるブログ記事を作成してください。見出しや段落構成も含めて提案してください。`;
}

// レポートプロンプト生成関数
function generateReportPrompt(data) {
    const hasAllData = data.visitDate || data.clientInfo || data.ourAttendees || data.purpose || 
                      data.discussionPoints || data.decisionsAgreements || data.pendingIssues || 
                      data.nextActions || data.impressionsNotes || data.specialMention;
    
    if (!hasAllData) {
        return '訪問レポートの情報を入力してください。';
    }

    return `以下の情報に基づいて、明確で簡潔な訪問レポートを作成してください：

【訪問日】
${data.visitDate || '（未記入）'}

【訪問先情報】
${data.clientInfo || '（未記入）'}

【自社訪問者】
${data.ourAttendees || '（未記入）'}

【訪問目的】
${data.purpose || '（未記入）'}

【議題・協議内容】
${data.discussionPoints || '（未記入）'}

【決定事項・合意内容】
${data.decisionsAgreements || '（未記入）'}

【ペンディング事項】
${data.pendingIssues || '（未記入）'}

【次回までのアクション】
${data.nextActions || '（未記入）'}

【所感・気づき】
${data.impressionsNotes || '（未記入）'}

【特に伝えたいこと】
${data.specialMention || '（未記入）'}

上記を踏まえて、関係者が素早く理解できるよう構造化された訪問レポートを作成してください。重要なポイントは強調し、次のアクションが明確になるようにしてください。`;
}

// Node.js環境でのみエクスポート（テスト用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateEmailPrompt,
        generateSnsPrompt,
        generateBlogPrompt,
        generateReportPrompt
    };
}