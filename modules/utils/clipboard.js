// clipboard.js - クリップボード操作ユーティリティ

// テキストをクリップボードにコピー
export async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true, method: 'modern' };
    } catch (err) {
      console.error('クリップボードへのコピーに失敗しました:', err);
      return fallbackCopyTextToClipboard(text);
    }
  } else {
    return fallbackCopyTextToClipboard(text);
  }
}

// フォールバックコピー関数
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return { success: successful, method: 'fallback' };
  } catch (err) {
    console.error('Fallback: クリップボードへのコピーに失敗しました', err);
    document.body.removeChild(textArea);
    return { success: false, method: 'fallback' };
  }
}