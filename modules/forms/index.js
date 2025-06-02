// index.js - フォームモジュールのエクスポート

export { formConfig, tabOrder } from './config.js';
export { createFormContainer, createTabButton } from './formBuilder.js';
export { 
  generateEmailPrompt, 
  generateSnsPrompt, 
  generateBlogPrompt, 
  generateReportPrompt 
} from './promptGenerators.js';