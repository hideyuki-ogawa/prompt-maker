/**
 * テスト用ヘルパー関数
 * main.jsの機能をテスト環境で利用できるように抽出
 */

// DOM操作のモック
const createMockDOM = () => {
  global.document = {
    createElement: jest.fn(() => ({
      appendChild: jest.fn(),
      classList: { add: jest.fn(), remove: jest.fn() },
      setAttribute: jest.fn(),
      addEventListener: jest.fn()
    })),
    getElementById: jest.fn(),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(() => [])
  };
};

// main.jsのクリア機能を抽出（テスト用）
const createClearFunction = (dependencies) => {
  return function executeClear() {
    const { currentTab, formConfig, elements, showToast } = dependencies;
    
    // feedbackタブではクリア機能を無効にする
    if (currentTab === 'feedback') {
      showToast('フィードバックタブではクリア機能は利用できません。', true);
      return;
    }

    // 現在のタブのフィールド情報を取得
    const currentFormConfig = formConfig && formConfig[currentTab];
    if (!currentFormConfig || !currentFormConfig.fields) {
      if (elements && elements.promptOutputDiv) {
        elements.promptOutputDiv.textContent = 'ここにプロンプトが表示されます...';
      }
      showToast('クリアするフィールドがありませんでした。', true);
      return;
    }
    
    let clearedCount = 0;
    
    currentFormConfig.fields.forEach(field => {
      if (field.type === 'checkbox-group') {
        // チェックボックスグループの処理
        const protectCheckbox = document.getElementById(`protect_${field.id}`);
        const isProtected = protectCheckbox && protectCheckbox.checked;
        
        if (!isProtected) {
          // グループ全体をクリア
          const checkboxes = document.querySelectorAll(`input[name="${field.id}"]`);
          checkboxes.forEach(cb => {
            if (cb.checked) {
              cb.checked = false;
              clearedCount++;
            }
          });
        }
        
        // その他入力フィールドの処理（常にクリア）
        const otherInput = document.getElementById(`${field.id}_other`);
        if (otherInput && otherInput.value.trim()) {
          otherInput.value = '';
          otherInput.classList.add('hidden');
          clearedCount++;
        }
      } else {
        // 通常のフィールド
        const protectCheckbox = document.getElementById(`protect_${field.id}`);
        const isProtected = protectCheckbox && protectCheckbox.checked;
        
        if (!isProtected) {
          const element = document.getElementById(field.id);
          if (element && element.value.trim()) {
            element.value = '';
            clearedCount++;
          }
        }
      }
    });
    
    // プロンプト表示もクリア
    if (elements.promptOutputDiv) {
      elements.promptOutputDiv.textContent = 'ここにプロンプトが表示されます...';
    }
    
    // 結果をトーストで表示
    if (clearedCount > 0) {
      showToast(`${clearedCount}個のフィールドをクリアしました。`);
    } else {
      showToast('クリアするフィールドがありませんでした。', true);
    }
  };
};

// DOM要素のモックファクトリ
const createMockElement = (tagName, properties = {}) => ({
  tagName,
  value: '',
  textContent: '',
  checked: false,
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn()
  },
  addEventListener: jest.fn(),
  setAttribute: jest.fn(),
  appendChild: jest.fn(),
  ...properties
});

// フォーム設定のモック
const createMockFormConfig = () => ({
  email: {
    id: 'email',
    fields: [
      { id: 'email_purpose', type: 'checkbox-group' },
      { id: 'email_to_info', type: 'text' },
      { id: 'email_sender_relation', type: 'text' },
      { id: 'email_main_points', type: 'textarea' },
      { id: 'email_tone', type: 'select' },
      { id: 'email_keywords', type: 'text' },
      { id: 'email_call_to_action', type: 'text' },
      { id: 'email_length_limit', type: 'text' },
      { id: 'email_signature', type: 'textarea' }
    ]
  },
  sns: {
    id: 'sns',
    fields: [
      { id: 'sns_platform', type: 'select' },
      { id: 'sns_purpose', type: 'text' },
      { id: 'sns_target_audience', type: 'text' },
      { id: 'sns_main_message', type: 'textarea' },
      { id: 'sns_keywords_hashtags', type: 'text' },
      { id: 'sns_tone', type: 'select' },
      { id: 'sns_call_to_action', type: 'text' },
      { id: 'sns_image_video_info', type: 'text' }
    ]
  },
  blog: {
    id: 'blog',
    fields: [
      { id: 'blog_topic_title', type: 'text' },
      { id: 'blog_target_reader', type: 'text' },
      { id: 'blog_reader_benefit', type: 'textarea' },
      { id: 'blog_structure_outline', type: 'textarea' },
      { id: 'blog_seo_keywords', type: 'text' },
      { id: 'blog_style_tone', type: 'select' },
      { id: 'blog_reference_material', type: 'text' },
      { id: 'blog_call_to_action', type: 'text' }
    ]
  },
  report: {
    id: 'report',
    fields: [
      { id: 'report_visit_date', type: 'date' },
      { id: 'report_client_info', type: 'text' },
      { id: 'report_our_attendees', type: 'text' },
      { id: 'report_purpose', type: 'text' },
      { id: 'report_discussion_points', type: 'textarea' },
      { id: 'report_decisions_agreements', type: 'textarea' },
      { id: 'report_pending_issues', type: 'textarea' },
      { id: 'report_next_actions', type: 'textarea' },
      { id: 'report_impressions_notes', type: 'textarea' },
      { id: 'report_special_mention', type: 'text' }
    ]
  },
  feedback: {
    id: 'feedback',
    isSpecial: true
  }
});

module.exports = {
  createMockDOM,
  createClearFunction,
  createMockElement,
  createMockFormConfig
};