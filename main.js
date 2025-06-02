// main.js - メインアプリケーションロジック

import { 
  formConfig, 
  tabOrder,
  createFormContainer, 
  createTabButton,
  generateEmailPrompt, 
  generateSnsPrompt, 
  generateBlogPrompt, 
  generateReportPrompt 
} from './modules/forms/index.js';
import { showToast, initToast, copyToClipboard } from './modules/utils/index.js';

// グローバル変数
let currentTab = 'email'; // 初期タブ

// DOM要素のキャッシュ
const elements = {};

// 初期化関数
function init() {
  // DOM要素を取得
  elements.tabContainer = document.querySelector('.tab-container');
  elements.formSection = document.querySelector('.form-section');
  elements.generateBtn = document.getElementById('generateBtn');
  elements.promptOutputDiv = document.getElementById('promptOutput');
  elements.copyBtn = document.getElementById('copyBtn');
  elements.toastMessage = document.getElementById('toastMessage');
  elements.previewSection = document.querySelector('.preview-section');
  elements.gridContainer = document.querySelector('.grid');
  
  // タブとフォームを動的に生成
  createTabs();
  createForms();
  
  // トーストを初期化
  initToast(elements.toastMessage);
  
  // イベントリスナーを設定
  setupEventListeners();
  
  // 初期タブをアクティブに
  activateTab('email');
}

// タブボタンを動的に生成
function createTabs() {
  elements.tabContainer.innerHTML = '';
  tabOrder.forEach(tabId => {
    const tabData = formConfig[tabId];
    const button = createTabButton(tabData);
    elements.tabContainer.appendChild(button);
  });
}

// フォームコンテナを動的に生成
function createForms() {
  // 生成ボタンの前にあるすべてのフォームコンテナを削除
  const existingContainers = elements.formSection.querySelectorAll('.form-container');
  existingContainers.forEach(container => container.remove());
  
  // 新しいフォームコンテナを生成
  tabOrder.forEach(tabId => {
    const formData = formConfig[tabId];
    const container = createFormContainer(formData);
    elements.formSection.insertBefore(container, elements.generateBtn.parentElement);
  });
}

// タブをアクティブにする
function activateTab(tabName) {
  currentTab = tabName;
  
  // タブボタンの状態を更新
  const tabButtons = elements.tabContainer.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    if (button.dataset.tab === tabName) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  
  // フォームコンテナの表示を更新
  const formContainers = elements.formSection.querySelectorAll('.form-container');
  formContainers.forEach(container => {
    if (container.id === `${tabName}FormContainer`) {
      container.classList.add('active');
    } else {
      container.classList.remove('active');
    }
  });
  
  // フィードバックタブの特別な処理
  if (tabName === 'feedback') {
    elements.generateBtn.style.display = 'none';
    if (elements.previewSection) {
      elements.previewSection.style.display = 'none';
    }
    if (elements.gridContainer) {
      elements.gridContainer.classList.remove('md:grid-cols-2');
      elements.gridContainer.classList.add('md:grid-cols-1');
    }
  } else {
    elements.generateBtn.style.display = 'block';
    if (elements.previewSection) {
      elements.previewSection.style.display = 'block';
    }
    if (elements.gridContainer) {
      elements.gridContainer.classList.remove('md:grid-cols-1');
      elements.gridContainer.classList.add('md:grid-cols-2');
    }
    elements.promptOutputDiv.textContent = 'ここにプロンプトが表示されます...';
  }
}

// イベントリスナーの設定
function setupEventListeners() {
  // タブ切り替え
  elements.tabContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-button')) {
      const tabName = e.target.dataset.tab;
      activateTab(tabName);
    }
  });
  
  // プロンプト生成
  elements.generateBtn.addEventListener('click', generatePrompt);
  
  // コピーボタン
  elements.copyBtn.addEventListener('click', copyPrompt);
  
  // メール目的「その他」チェックボックスの処理
  setupEmailOtherCheckbox();
}

// メール目的「その他」チェックボックスの設定
function setupEmailOtherCheckbox() {
  // 動的に生成された要素なので、イベント委譲を使用
  elements.formSection.addEventListener('change', (e) => {
    if (e.target.id === 'email_purpose_other_checkbox') {
      const otherInput = document.getElementById('email_purpose_other');
      if (otherInput) {
        if (e.target.checked) {
          otherInput.classList.remove('hidden');
          otherInput.focus();
        } else {
          otherInput.classList.add('hidden');
          otherInput.value = '';
        }
      }
    }
  });
}

// プロンプト生成処理
function generatePrompt() {
  let formData = {};
  let prompt = '';
  
  switch (currentTab) {
    case 'email':
      formData = collectEmailFormData();
      prompt = generateEmailPrompt(formData);
      break;
    case 'sns':
      formData = collectSnsFormData();
      prompt = generateSnsPrompt(formData);
      break;
    case 'blog':
      formData = collectBlogFormData();
      prompt = generateBlogPrompt(formData);
      break;
    case 'report':
      formData = collectReportFormData();
      prompt = generateReportPrompt(formData);
      break;
  }
  
  elements.promptOutputDiv.textContent = prompt.trim();
}

// フォームデータ収集関数
function collectEmailFormData() {
  // チェックボックスで選択された目的を取得
  const checkedPurposes = [];
  const purposeCheckboxes = document.querySelectorAll('input[name="email_purpose"]:checked');
  const otherInput = document.getElementById('email_purpose_other');
  
  purposeCheckboxes.forEach(checkbox => {
    if (checkbox.value === 'その他' && otherInput) {
      const otherValue = otherInput.value.trim();
      if (otherValue) {
        checkedPurposes.push(`その他（${otherValue}）`);
      }
    } else {
      checkedPurposes.push(checkbox.value);
    }
  });
  
  const purposeValue = checkedPurposes.length > 0 ? checkedPurposes.join('、') : '指定なし';
  
  return {
    purpose: purposeValue,
    toInfo: document.getElementById('email_to_info').value.trim() || '指定なし',
    senderRelation: document.getElementById('email_sender_relation').value.trim() || '指定なし',
    mainPoints: document.getElementById('email_main_points').value.trim() || '指定なし',
    tone: document.getElementById('email_tone').value,
    keywords: document.getElementById('email_keywords').value.trim() || '特になし',
    callToAction: document.getElementById('email_call_to_action').value.trim() || '特になし',
    signature: document.getElementById('email_signature').value.trim() || '指定なし'
  };
}

function collectSnsFormData() {
  return {
    platform: document.getElementById('sns_platform').value,
    purpose: document.getElementById('sns_purpose').value.trim() || '指定なし',
    targetAudience: document.getElementById('sns_target_audience').value.trim() || '指定なし',
    mainMessage: document.getElementById('sns_main_message').value.trim() || '指定なし',
    keywordsHashtags: document.getElementById('sns_keywords_hashtags').value.trim() || '特になし',
    tone: document.getElementById('sns_tone').value,
    callToAction: document.getElementById('sns_call_to_action').value.trim() || '特になし',
    imageVideoInfo: document.getElementById('sns_image_video_info').value.trim() || '特になし'
  };
}

function collectBlogFormData() {
  return {
    topicTitle: document.getElementById('blog_topic_title').value.trim() || '指定なし',
    targetReader: document.getElementById('blog_target_reader').value.trim() || '指定なし',
    readerBenefit: document.getElementById('blog_reader_benefit').value.trim() || '指定なし',
    structureOutline: document.getElementById('blog_structure_outline').value.trim() || '指定なし',
    seoKeywords: document.getElementById('blog_seo_keywords').value.trim() || '特になし',
    styleTone: document.getElementById('blog_style_tone').value,
    referenceMaterial: document.getElementById('blog_reference_material').value.trim() || '特になし',
    callToAction: document.getElementById('blog_call_to_action').value.trim() || '特になし'
  };
}

function collectReportFormData() {
  return {
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
}

// プロンプトコピー処理
async function copyPrompt() {
  const textToCopy = elements.promptOutputDiv.textContent;
  if (!textToCopy || textToCopy === 'ここにプロンプトが表示されます...') {
    showToast('コピーするプロンプトがありません。', true);
    return;
  }
  
  const result = await copyToClipboard(textToCopy);
  if (result.success) {
    showToast('プロンプトをコピーしました！');
  } else {
    showToast('コピーに失敗しました。', true);
  }
}


// DOMContentLoadedイベントで初期化
document.addEventListener('DOMContentLoaded', init);