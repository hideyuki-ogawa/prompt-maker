// config.js - フォーム設定データ

export const formConfig = {
  email: {
    id: 'email',
    title: 'メール作成',
    formTitle: 'メール情報を入力',
    fields: [
      {
        id: 'email_purpose',
        label: 'メールの目的 (複数選択可):',
        type: 'checkbox-group',
        options: [
          { value: 'アポイント依頼', label: 'アポイント依頼' },
          { value: 'お礼', label: 'お礼' },
          { value: '情報共有', label: '情報共有' },
          { value: '問い合わせ', label: '問い合わせ' },
          { value: '提案', label: '提案' },
          { value: '苦情・要望', label: '苦情・要望' },
          { value: 'その他', label: 'その他（自由記述）', hasOtherInput: true }
        ]
      },
      {
        id: 'email_to_info',
        label: '宛先情報:',
        type: 'text',
        placeholder: '例: 株式会社〇〇 △△部 部長 □□様'
      },
      {
        id: 'email_sender_relation',
        label: '送信者の立場・相手との関係性:',
        type: 'text',
        placeholder: '例: 弊社の新サービス担当、既存顧客'
      },
      {
        id: 'email_main_points',
        label: '主要な伝達事項 (箇条書き推奨):',
        type: 'textarea',
        placeholder: '例:\n- 新製品〇〇のご案内\n- △△に関するお打ち合わせのお願い'
      },
      {
        id: 'email_tone',
        label: '希望するトーン:',
        type: 'select',
        options: [
          { value: 'フォーマル', label: 'フォーマル' },
          { value: '丁寧', label: '丁寧' },
          { value: 'ややカジュアル', label: 'ややカジュアル' },
          { value: 'フレンドリー', label: 'フレンドリー' },
          { value: '緊急性が高い', label: '緊急性が高い' }
        ]
      },
      {
        id: 'email_keywords',
        label: '含めたいキーワード (カンマ区切り):',
        type: 'text',
        placeholder: '例: 新機能, コスト削減, 期間限定'
      },
      {
        id: 'email_call_to_action',
        label: '相手に促したい行動:',
        type: 'text',
        placeholder: '例: ご返信お待ちしております'
      },
      {
        id: 'email_signature',
        label: '署名情報:',
        type: 'textarea',
        placeholder: '例:\n株式会社 長目\n営業部 田中太郎'
      }
    ]
  },
  sns: {
    id: 'sns',
    title: 'SNS投稿作成',
    formTitle: 'SNS投稿情報を入力',
    fields: [
      {
        id: 'sns_platform',
        label: '利用SNSプラットフォーム:',
        type: 'select',
        options: [
          { value: 'X (旧Twitter)', label: 'X (旧Twitter)' },
          { value: 'Facebook', label: 'Facebook' },
          { value: 'Instagram', label: 'Instagram' },
          { value: 'LinkedIn', label: 'LinkedIn' },
          { value: 'TikTok', label: 'TikTok' },
          { value: 'その他', label: 'その他' }
        ]
      },
      {
        id: 'sns_purpose',
        label: '投稿の目的:',
        type: 'text',
        placeholder: '例: 新製品紹介, イベント告知'
      },
      {
        id: 'sns_target_audience',
        label: 'ターゲット層:',
        type: 'text',
        placeholder: '例: 20代女性, IT業界のマネージャー層'
      },
      {
        id: 'sns_main_message',
        label: '最も伝えたいメッセージ (簡潔に):',
        type: 'textarea',
        placeholder: '例: 本日より新サービス開始！'
      },
      {
        id: 'sns_keywords_hashtags',
        label: '含めたいキーワード/ハッシュタグ候補 (カンマ区切り):',
        type: 'text',
        placeholder: '例: #新発売, #期間限定キャンペーン'
      },
      {
        id: 'sns_tone',
        label: '希望する投稿の雰囲気・トーン:',
        type: 'select',
        options: [
          { value: '親しみやすい', label: '親しみやすい' },
          { value: '専門的', label: '専門的' },
          { value: 'ユーモラス', label: 'ユーモラス' },
          { value: '感動的', label: '感動的' },
          { value: '情報提供重視', label: '情報提供重視' }
        ]
      },
      {
        id: 'sns_call_to_action',
        label: 'コールトゥアクション (任意):',
        type: 'text',
        placeholder: '例: いいね・シェアをお願いします！, プロフィールリンクをチェック'
      },
      {
        id: 'sns_image_video_info',
        label: '画像/動画の有無・簡単な説明 (任意):',
        type: 'text',
        placeholder: '例: 製品の魅力的な写真を使用'
      }
    ]
  },
  blog: {
    id: 'blog',
    title: 'ブログ記事作成',
    formTitle: 'ブログ記事情報を入力',
    fields: [
      {
        id: 'blog_topic_title',
        label: '記事のメイントピック/仮タイトル:',
        type: 'text',
        placeholder: '例: 生成AI活用のための5つのステップ'
      },
      {
        id: 'blog_target_reader',
        label: 'ターゲット読者層:',
        type: 'text',
        placeholder: '例: 生成AI初心者, 中小企業経営者'
      },
      {
        id: 'blog_reader_benefit',
        label: '読者が記事を読むことで得られるメリット/解決できる課題:',
        type: 'textarea',
        placeholder: '例: AI導入の具体的な方法がわかる'
      },
      {
        id: 'blog_structure_outline',
        label: '記事の主要な構成案/見出し案 (箇条書き推奨):',
        type: 'textarea',
        placeholder: '例:\n- はじめに\n- ステップ1: 課題の特定\n- まとめ'
      },
      {
        id: 'blog_seo_keywords',
        label: '必ず含めたいキーワード (SEO対策, カンマ区切り):',
        type: 'text',
        placeholder: '例: 生成AI, 業務効率化, DX推進'
      },
      {
        id: 'blog_style_tone',
        label: '希望する文体・トーン:',
        type: 'select',
        options: [
          { value: '解説調', label: '解説調' },
          { value: '事例紹介', label: '事例紹介' },
          { value: 'インタビュー風', label: 'インタビュー風' },
          { value: 'フレンドリー', label: 'フレンドリー' },
          { value: '専門的', label: '専門的' }
        ]
      },
      {
        id: 'blog_reference_material',
        label: '参考資料/データ (任意):',
        type: 'text',
        placeholder: '例: 〇〇調査レポート, 弊社導入事例'
      },
      {
        id: 'blog_call_to_action',
        label: '読者に促したい行動 (任意):',
        type: 'text',
        placeholder: '例: 関連資料のダウンロード, お問い合わせはこちら'
      }
    ]
  },
  report: {
    id: 'report',
    title: '訪問報告書作成',
    formTitle: '訪問報告書情報を入力',
    fields: [
      {
        id: 'report_visit_date',
        label: '訪問日:',
        type: 'date',
        class: 'w-auto'
      },
      {
        id: 'report_client_info',
        label: '訪問先企業・部署・担当者名:',
        type: 'text',
        placeholder: '例: 株式会社△△ 技術部 □□様'
      },
      {
        id: 'report_our_attendees',
        label: '自社訪問者:',
        type: 'text',
        placeholder: '例: 田中太郎, 佐藤花子'
      },
      {
        id: 'report_purpose',
        label: '訪問目的:',
        type: 'text',
        placeholder: '例: 新規システム導入に関するご提案'
      },
      {
        id: 'report_discussion_points',
        label: '主要な議題・協議内容 (箇条書き推奨):',
        type: 'textarea',
        placeholder: '例:\n- 現状の課題ヒアリング\n- 提案システムの概要説明'
      },
      {
        id: 'report_decisions_agreements',
        label: '決定事項・合意事項 (箇条書き推奨):',
        type: 'textarea',
        placeholder: '例:\n- 次回デモ実施日程の調整\n- 見積もり提出の合意'
      },
      {
        id: 'report_pending_issues',
        label: 'ペンディング事項・課題 (箇条書き推奨):',
        type: 'textarea',
        placeholder: '例:\n- 詳細な要件定義の確認\n- 費用対効果の再検討'
      },
      {
        id: 'report_next_actions',
        label: '次回までのアクションプラン (担当者、期限含む):',
        type: 'textarea',
        placeholder: '例:\n- 〇〇様: デモ環境準備 (X月Y日まで)\n- 当社: 見積書作成 (X月Z日まで)'
      },
      {
        id: 'report_impressions_notes',
        label: '所感・気づき:',
        type: 'textarea',
        placeholder: '例: 先方のAI活用への関心は非常に高い。'
      },
      {
        id: 'report_special_mention',
        label: '報告書を読む相手に特に伝えたいこと:',
        type: 'text',
        placeholder: '例: 予算確保の必要性について上長へ報告願います。'
      }
    ]
  },
  feedback: {
    id: 'feedback',
    title: '改善提案',
    formTitle: '機能追加・改善提案',
    isSpecial: true, // 特殊なタブ（フォームではない）
    content: {
      description: 'はんなりプロンプトキッチンをより良くするために、皆様のご意見をお聞かせください。機能追加のご要望や改善提案がございましたら、以下のフォームからお寄せください。',
      iframeUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScOQ13c7V2MZKMyoQm2luvhNUcXc1sN1OrnAg34LSXrHXRDEg/viewform?embedded=true',
      note: '※ いただいたご提案は今後の開発の参考にさせていただきます'
    }
  }
};

// タブの順序を定義
export const tabOrder = ['email', 'sns', 'blog', 'report', 'feedback'];