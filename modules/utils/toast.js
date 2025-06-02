// toast.js - トーストメッセージ表示ユーティリティ

let toastTimeout;
let toastElement;

// トーストメッセージ要素を設定
export function initToast(element) {
  toastElement = element;
}

// トーストメッセージを表示
export function showToast(message, isError = false) {
  if (!toastElement) {
    console.error('Toast element not initialized');
    return;
  }
  
  toastElement.textContent = message;
  toastElement.style.backgroundColor = isError ? '#ef4444' : '#10b981';
  toastElement.classList.add('show');
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastElement.classList.remove('show');
  }, 3000);
}