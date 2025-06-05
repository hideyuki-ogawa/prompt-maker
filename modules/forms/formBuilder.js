// formBuilder.js - 動的フォーム生成モジュール

export function createFormField(field) {
  const fieldWrapper = document.createElement('div');
  fieldWrapper.className = 'field-wrapper';
  
  // ラベルと保護チェックボックスのコンテナを作成
  const labelContainer = document.createElement('div');
  labelContainer.className = 'field-label-container';
  
  // ラベルを作成
  const label = document.createElement('label');
  label.setAttribute('for', field.id);
  label.textContent = field.label;
  labelContainer.appendChild(label);
  
  // 保護チェックボックスを作成
  const protectWrapper = document.createElement('div');
  protectWrapper.className = 'protect-checkbox-wrapper';
  
  const protectCheckbox = document.createElement('input');
  protectCheckbox.type = 'checkbox';
  protectCheckbox.id = `protect_${field.id}`;
  protectCheckbox.className = 'protect-checkbox';
  protectCheckbox.title = 'チェックするとクリア時に保護されます';
  
  const protectLabel = document.createElement('label');
  protectLabel.setAttribute('for', `protect_${field.id}`);
  protectLabel.textContent = '保護';
  protectLabel.className = 'protect-label';
  
  protectWrapper.appendChild(protectCheckbox);
  protectWrapper.appendChild(protectLabel);
  labelContainer.appendChild(protectWrapper);
  
  fieldWrapper.appendChild(labelContainer);
  
  // フィールドタイプに応じて要素を作成
  switch (field.type) {
    case 'text':
      const input = document.createElement('input');
      input.type = 'text';
      input.id = field.id;
      input.name = field.id;
      if (field.placeholder) input.placeholder = field.placeholder;
      if (field.class) input.className = field.class;
      fieldWrapper.appendChild(input);
      break;
      
    case 'date':
      const dateInput = document.createElement('input');
      dateInput.type = 'date';
      dateInput.id = field.id;
      dateInput.name = field.id;
      if (field.class) dateInput.className = field.class;
      fieldWrapper.appendChild(dateInput);
      break;
      
    case 'textarea':
      const textarea = document.createElement('textarea');
      textarea.id = field.id;
      textarea.name = field.id;
      if (field.placeholder) textarea.placeholder = field.placeholder;
      fieldWrapper.appendChild(textarea);
      break;
      
    case 'select':
      const select = document.createElement('select');
      select.id = field.id;
      select.name = field.id;
      field.options.forEach(option => {
        const optionEl = document.createElement('option');
        optionEl.value = option.value;
        optionEl.textContent = option.label;
        select.appendChild(optionEl);
      });
      fieldWrapper.appendChild(select);
      break;
      
    case 'checkbox-group':
      const checkboxContainer = document.createElement('div');
      checkboxContainer.id = `${field.id}_container`;
      checkboxContainer.className = 'checkbox-group';
      
      field.options.forEach(option => {
        const checkboxLabel = document.createElement('label');
        checkboxLabel.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = field.id;
        checkbox.value = option.value;
        if (option.hasOtherInput) {
          checkbox.id = `${field.id}_other_checkbox`;
        }
        
        const checkmark = document.createElement('span');
        checkmark.className = 'checkmark';
        
        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(checkmark);
        checkboxLabel.appendChild(document.createTextNode(option.label));
        
        checkboxContainer.appendChild(checkboxLabel);
      });
      
      fieldWrapper.appendChild(checkboxContainer);
      
      // "その他"用の入力フィールドを追加
      const hasOtherOption = field.options.some(opt => opt.hasOtherInput);
      if (hasOtherOption) {
        const otherLabel = document.createElement('label');
        otherLabel.setAttribute('for', `${field.id}_other`);
        otherLabel.textContent = 'その他の詳細:';
        otherLabel.className = 'text-sm mt-2 block';
        
        const otherInput = document.createElement('input');
        otherInput.type = 'text';
        otherInput.id = `${field.id}_other`;
        otherInput.name = `${field.id}_other`;
        otherInput.placeholder = 'その他の目的を具体的に入力';
        otherInput.className = 'mt-2 hidden';
        
        fieldWrapper.appendChild(otherLabel);
        fieldWrapper.appendChild(otherInput);
      }
      break;
  }
  
  return fieldWrapper;
}

export function createFormContainer(formData) {
  const container = document.createElement('div');
  container.id = `${formData.id}FormContainer`;
  container.className = 'form-container';
  
  // 特殊なタブ（フィードバックなど）の処理
  if (formData.isSpecial) {
    const title = document.createElement('h2');
    title.className = 'text-xl font-semibold text-gray-700 mb-6';
    title.textContent = `1. ${formData.formTitle}`;
    container.appendChild(title);
    
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'space-y-6';
    
    const description = document.createElement('p');
    description.className = 'text-gray-600';
    description.textContent = formData.content.description;
    contentWrapper.appendChild(description);
    
    const iframeContainer = document.createElement('div');
    iframeContainer.className = 'google-form-container';
    
    const iframe = document.createElement('iframe');
    iframe.src = formData.content.iframeUrl;
    iframe.width = '100%';
    iframe.height = '800';
    iframe.frameBorder = '0';
    iframe.marginHeight = '0';
    iframe.marginWidth = '0';
    iframe.textContent = '読み込み中…';
    
    iframeContainer.appendChild(iframe);
    contentWrapper.appendChild(iframeContainer);
    
    const noteDiv = document.createElement('div');
    noteDiv.className = 'text-sm text-gray-500';
    const noteP = document.createElement('p');
    noteP.textContent = formData.content.note;
    noteDiv.appendChild(noteP);
    contentWrapper.appendChild(noteDiv);
    
    container.appendChild(contentWrapper);
    return container;
  }
  
  // 通常のフォームコンテナ
  const title = document.createElement('h2');
  title.className = 'text-xl font-semibold text-gray-700 mb-6';
  title.textContent = `1. ${formData.formTitle}`;
  container.appendChild(title);
  
  const form = document.createElement('form');
  form.id = `${formData.id}PromptForm`;
  form.className = 'space-y-6';
  
  // 各フィールドを作成
  formData.fields.forEach(field => {
    const fieldElement = createFormField(field);
    form.appendChild(fieldElement);
  });
  
  container.appendChild(form);
  return container;
}

export function createTabButton(tabData) {
  const button = document.createElement('button');
  button.className = 'tab-button';
  button.dataset.tab = tabData.id;
  button.textContent = tabData.title;
  return button;
}