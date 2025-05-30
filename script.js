// script.js

// DOM要素の取得
const tabButtons = document.querySelectorAll('.tab-button');
const formContainers = document.querySelectorAll('.form-container');
const generateBtn = document.getElementById('generateBtn');
const promptOutputDiv = document.getElementById('promptOutput');
const copyBtn = document.getElementById('copyBtn');
const toastMessage = document.getElementById('toastMessage');

// メールフォーム特有の要素
const emailPurposeOtherCheckbox = document.getElementById('email_purpose_other_checkbox');
const emailPurposeOtherInput = document.getElementById('email_purpose_other');

let currentTab = 'email'; // 初期タブ

// タブ切り替え処理
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.dataset.tab;
        currentTab = tabName;

        // すべてのタブボタンからactiveクラスを削除
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // クリックされたタブボタンにactiveクラスを追加
        button.classList.add('active');

        // すべてのフォームコンテナを非表示
        formContainers.forEach(container => {
            container.classList.remove('active');
            // 対応するフォームコンテナを表示
            if (container.id === `${tabName}FormContainer`) {
                container.classList.add('active');
            }
        });
        
        // フィードバックタブの場合は、生成ボタンとプロンプト表示エリアを非表示に
        const previewSection = document.querySelector('.preview-section');
        if (tabName === 'feedback') {
            generateBtn.style.display = 'none';
            if (previewSection) {
                previewSection.style.display = 'none';
            }
        } else {
            generateBtn.style.display = 'block';
            if (previewSection) {
                previewSection.style.display = 'block';
            }
            promptOutputDiv.textContent = 'ここにプロンプトが表示されます...'; // タブ切り替え時にプロンプト表示をリセット
        }
    });
});

// メール目的「その他」の処理
if (emailPurposeOtherCheckbox) {
    emailPurposeOtherCheckbox.addEventListener('change', function() {
        if (this.checked) {
            emailPurposeOtherInput.classList.remove('hidden');
            emailPurposeOtherInput.focus();
        } else {
            emailPurposeOtherInput.classList.add('hidden');
        }
    });
    // 初期状態で「その他」の入力欄を非表示にする
    if (emailPurposeOtherInput) {
        emailPurposeOtherInput.classList.add('hidden');
    }
}


// プロンプト生成ボタンのイベントリスナー
generateBtn.addEventListener('click', function() {
    let formData = {};
    let prompt = '';

    // 現在アクティブなタブに応じてフォームデータを収集し、プロンプトを生成
    if (currentTab === 'email') {
        // チェックボックスで選択された目的を取得
        const checkedPurposes = [];
        const purposeCheckboxes = document.querySelectorAll('input[name="email_purpose"]:checked');
        purposeCheckboxes.forEach(checkbox => {
            if (checkbox.value === 'その他' && emailPurposeOtherInput) {
                const otherValue = emailPurposeOtherInput.value.trim();
                if (otherValue) {
                    checkedPurposes.push(`その他（${otherValue}）`);
                }
            } else {
                checkedPurposes.push(checkbox.value);
            }
        });
        
        const purposeValue = checkedPurposes.length > 0 ? checkedPurposes.join('、') : '指定なし';
        
        formData = {
            purpose: purposeValue,
            toInfo: document.getElementById('email_to_info').value.trim() || '指定なし',
            senderRelation: document.getElementById('email_sender_relation').value.trim() || '指定なし',
            mainPoints: document.getElementById('email_main_points').value.trim() || '指定なし',
            tone: document.getElementById('email_tone').value,
            keywords: document.getElementById('email_keywords').value.trim() || '特になし',
            callToAction: document.getElementById('email_call_to_action').value.trim() || '特になし',
            signature: document.getElementById('email_signature').value.trim() || '指定なし'
        };
        prompt = generateEmailPrompt(formData);
    } else if (currentTab === 'sns') {
        formData = {
            platform: document.getElementById('sns_platform').value,
            purpose: document.getElementById('sns_purpose').value.trim() || '指定なし',
            targetAudience: document.getElementById('sns_target_audience').value.trim() || '指定なし',
            mainMessage: document.getElementById('sns_main_message').value.trim() || '指定なし',
            keywordsHashtags: document.getElementById('sns_keywords_hashtags').value.trim() || '特になし',
            tone: document.getElementById('sns_tone').value,
            callToAction: document.getElementById('sns_call_to_action').value.trim() || '特になし',
            imageVideoInfo: document.getElementById('sns_image_video_info').value.trim() || '特になし'
        };
        prompt = generateSnsPrompt(formData);
    } else if (currentTab === 'blog') {
        formData = {
            topicTitle: document.getElementById('blog_topic_title').value.trim() || '指定なし',
            targetReader: document.getElementById('blog_target_reader').value.trim() || '指定なし',
            readerBenefit: document.getElementById('blog_reader_benefit').value.trim() || '指定なし',
            structureOutline: document.getElementById('blog_structure_outline').value.trim() || '指定なし',
            seoKeywords: document.getElementById('blog_seo_keywords').value.trim() || '特になし',
            styleTone: document.getElementById('blog_style_tone').value,
            referenceMaterial: document.getElementById('blog_reference_material').value.trim() || '特になし',
            callToAction: document.getElementById('blog_call_to_action').value.trim() || '特になし'
        };
        prompt = generateBlogPrompt(formData);
    } else if (currentTab === 'report') {
        formData = {
            visitDate: document.getElementById('report_visit_date').value || '指定なし',
            clientInfo: document.getElementById('report_client_info').value.trim() || '指定なし',
            ourAttendees: document.getElementById('report_our_attendees').value.trim() || '指定なし',
            purpose: document.getElementById('report_purpose').value.trim() || '指定なし',
            discussionPoints: document.getElementById('report_discussion_points').value.trim() || '指定なし',
            decisionsAgreements: document.getElementById('report_decisions_agreements').value.trim() || '指定なし',
            pendingIssues: document.getElementById('report_pending_issues').value.trim() || '指定なし',
            nextActions: document.getElementById('report_next_actions').value.trim() || '指定なし',
            impressionsNotes: document.getElementById('report_impressions_notes').value.trim() || '指定なし',
            specialMention: document.getElementById('report_special_mention').value.trim() || '指定なし'
        };
        prompt = generateReportPrompt(formData);
    }

    promptOutputDiv.textContent = prompt.trim(); // 生成されたプロンプトを表示
});

// --- プロンプト生成関数群 ---
function generateEmailPrompt(data) {
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
以下の詳細情報に基づいて、ビジネスメールの本文を作成してください。

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
- 上記の情報を元に、自然で分かりやすい日本語のビジネスメール本文を作成してください。
- 件名は含めず、メール本文のみを生成してください。
- 敬語やビジネス表現を適切に使用してください。
- 箇条書きで指示された伝達事項は、自然な文章に組み込んでください。

---
上記指示に従って、メール本文を作成してください。
`;
}

function generateSnsPrompt(data) {
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

function generateBlogPrompt(data) {
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

function generateReportPrompt(data) {
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


// コピーボタンのイベントリスナー
copyBtn.addEventListener('click', function() {
    const textToCopy = promptOutputDiv.textContent;
    if (!textToCopy || textToCopy === 'ここにプロンプトが表示されます...') {
        showToast('コピーするプロンプトがありません。', true); // isError = true
        return;
    }

    // navigator.clipboard API を優先的に使用 (HTTPS接続時など、より安全な環境で利用可能)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                showToast('プロンプトをコピーしました！');
            })
            .catch(err => {
                console.error('クリップボードへのコピーに失敗しました (navigator.clipboard):', err);
                fallbackCopyTextToClipboard(textToCopy); // フォールバック実行
            });
    } else {
        // navigator.clipboard が使えない場合のフォールバック (http接続や古いブラウザなど)
        fallbackCopyTextToClipboard(textToCopy);
    }
});

// クリップボードコピーのフォールバック関数
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // スクロールしないように、また画面外に表示するためのスタイル設定
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0"; // 見えないようにする

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        // @ts-ignore - Legacy API but needed for older browsers
        const successful = document.execCommand('copy');
        const msg = successful ? 'プロンプトをコピーしました！(Fallback)' : 'コピーに失敗しました。(Fallback)';
        showToast(msg, !successful); // successfulでなければエラーとして表示
    } catch (err) {
        console.error('Fallback: クリップボードへのコピーに失敗しました', err);
        showToast('コピーに失敗しました。(Fallback)', true); // エラーとして表示
    }

    document.body.removeChild(textArea);
}

// トーストメッセージ表示関数
let toastTimeout; // トースト表示用のタイマーIDを保持
function showToast(message, isError = false) {
    toastMessage.textContent = message;
    // エラーの場合は背景色を赤系に、成功時は緑系に設定
    toastMessage.style.backgroundColor = isError ? '#ef4444' : '#10b981'; // Tailwind red-500 for error, green-500 for success
    toastMessage.classList.add('show');

    // 既存のタイマーがあればクリア (連続クリック時の重複表示を防ぐ)
    clearTimeout(toastTimeout);
    // 3秒後にトーストメッセージを非表示にするタイマーを設定
    toastTimeout = setTimeout(() => {
        toastMessage.classList.remove('show');
    }, 3000);
}
