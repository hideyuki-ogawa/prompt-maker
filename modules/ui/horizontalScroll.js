// horizontalScroll.js - 横スクロールUIコンポーネント

export class HorizontalScrollContainer {
  constructor(containerId, fields) {
    this.container = document.getElementById(containerId);
    this.fields = fields;
    this.currentIndex = 0;
    this.isScrollMode = false;
    this.init();
  }

  init() {
    this.createScrollContainer();
    this.createNavigationButtons();
    this.setupKeyboardNavigation();
    this.updateNavigation();
  }

  createScrollContainer() {
    // 横スクロール用のラッパーを作成
    const scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'horizontal-scroll-wrapper';
    
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'horizontal-scroll-container';
    scrollContainer.id = 'horizontal-scroll-container';
    
    // 各フィールドを個別のスライドとして作成
    this.fields.forEach((field, index) => {
      const slide = document.createElement('div');
      slide.className = 'scroll-slide';
      slide.dataset.index = index;
      
      // フィールドラベル
      const label = document.createElement('h3');
      label.className = 'slide-label';
      label.textContent = field.label;
      slide.appendChild(label);
      
      // フィールド入力エリア
      const inputArea = document.createElement('div');
      inputArea.className = 'slide-input-area';
      
      // フィールドタイプに応じて入力要素を作成
      let inputElement;
      
      switch(field.type) {
        case 'text':
        case 'date':
          inputElement = document.createElement('input');
          inputElement.type = field.type;
          inputElement.id = `scroll_${field.id}`;
          inputElement.name = field.id;
          if (field.placeholder) inputElement.placeholder = field.placeholder;
          if (field.maxLength) inputElement.maxLength = field.maxLength;
          break;
          
        case 'textarea':
          inputElement = document.createElement('textarea');
          inputElement.id = `scroll_${field.id}`;
          inputElement.name = field.id;
          if (field.placeholder) inputElement.placeholder = field.placeholder;
          if (field.maxLength) inputElement.maxLength = field.maxLength;
          if (field.rows) inputElement.rows = field.rows;
          break;
          
        case 'select':
          inputElement = document.createElement('select');
          inputElement.id = `scroll_${field.id}`;
          inputElement.name = field.id;
          field.options.forEach(option => {
            const optionEl = document.createElement('option');
            optionEl.value = option.value;
            optionEl.textContent = option.label;
            inputElement.appendChild(optionEl);
          });
          break;
          
        case 'checkbox-group':
          inputElement = document.createElement('div');
          inputElement.className = 'scroll-checkbox-group';
          inputElement.id = `scroll_${field.id}`;
          
          field.options.forEach((option, optionIndex) => {
            const checkboxWrapper = document.createElement('label');
            checkboxWrapper.className = 'scroll-checkbox-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = field.id;
            checkbox.value = option.value;
            checkbox.id = `scroll_${field.id}_${optionIndex}`;
            
            const checkmark = document.createElement('span');
            checkmark.className = 'scroll-checkmark';
            
            const labelText = document.createTextNode(option.label);
            
            checkboxWrapper.appendChild(checkbox);
            checkboxWrapper.appendChild(checkmark);
            checkboxWrapper.appendChild(labelText);
            
            inputElement.appendChild(checkboxWrapper);
            
            // "その他"入力フィールドの処理
            if (option.hasOtherInput) {
              const otherWrapper = document.createElement('div');
              otherWrapper.className = 'scroll-other-input-wrapper';
              
              const otherLabel = document.createElement('label');
              otherLabel.textContent = 'その他の詳細:';
              otherLabel.className = 'scroll-other-label';
              
              const otherInput = document.createElement('input');
              otherInput.type = 'text';
              otherInput.id = `scroll_${field.id}_other`;
              otherInput.name = `${field.id}_other`;
              otherInput.placeholder = 'その他の目的を具体的に入力';
              otherInput.className = 'scroll-other-input hidden';
              
              checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                  otherInput.classList.remove('hidden');
                  otherInput.focus();
                } else {
                  otherInput.classList.add('hidden');
                  otherInput.value = '';
                }
                this.syncCheckboxGroupWithOriginal(field.id);
              });
              
              otherInput.addEventListener('input', () => {
                this.syncCheckboxGroupWithOriginal(field.id);
              });
              
              otherWrapper.appendChild(otherLabel);
              otherWrapper.appendChild(otherInput);
              inputElement.appendChild(otherWrapper);
            }
          });
          break;
      }
      
      if (inputElement) {
        if (field.type === 'checkbox-group') {
          // checkbox-groupは個別の同期処理
          inputElement.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.syncCheckboxGroupWithOriginal(field.id));
            
            // 元のフィールドの状態を同期
            const originalCheckbox = document.querySelector(`input[name="${field.id}"][value="${checkbox.value}"]`);
            if (originalCheckbox && originalCheckbox.checked) {
              checkbox.checked = true;
            }
          });
          
          // その他入力フィールドの初期値設定
          const originalOtherInput = document.getElementById(`${field.id}_other`);
          const scrollOtherInput = document.getElementById(`scroll_${field.id}_other`);
          if (originalOtherInput && scrollOtherInput && originalOtherInput.value) {
            scrollOtherInput.value = originalOtherInput.value;
            scrollOtherInput.classList.remove('hidden');
          }
        } else {
          // 通常のフィールドの同期
          inputElement.addEventListener('input', () => this.syncWithOriginalField(field.id, inputElement.value));
          inputElement.addEventListener('change', () => this.syncWithOriginalField(field.id, inputElement.value));
          
          // 元のフィールドの値を取得して設定
          const originalField = document.getElementById(field.id);
          if (originalField && originalField.value) {
            inputElement.value = originalField.value;
          }
        }
        
        inputArea.appendChild(inputElement);
      }
      
      slide.appendChild(inputArea);
      scrollContainer.appendChild(slide);
    });
    
    scrollWrapper.appendChild(scrollContainer);
    this.container.appendChild(scrollWrapper);
  }

  createNavigationButtons() {
    const navContainer = document.createElement('div');
    navContainer.className = 'scroll-navigation';
    
    // 戻るボタン
    this.prevButton = document.createElement('button');
    this.prevButton.className = 'scroll-nav-btn scroll-prev-btn';
    this.prevButton.innerHTML = '← 戻る';
    this.prevButton.addEventListener('click', () => this.previousSlide());
    
    // スライド番号表示
    this.slideIndicator = document.createElement('div');
    this.slideIndicator.className = 'slide-indicator';
    
    // 次へボタン
    this.nextButton = document.createElement('button');
    this.nextButton.className = 'scroll-nav-btn scroll-next-btn';
    this.nextButton.innerHTML = '次へ →';
    this.nextButton.addEventListener('click', () => this.nextSlide());
    
    // 横スクロールモード切り替えボタン
    this.scrollModeToggle = document.createElement('button');
    this.scrollModeToggle.className = 'scroll-mode-toggle';
    this.scrollModeToggle.innerHTML = '横スクロールモード';
    this.scrollModeToggle.addEventListener('click', () => this.toggleScrollMode());
    
    navContainer.appendChild(this.scrollModeToggle);
    navContainer.appendChild(this.prevButton);
    navContainer.appendChild(this.slideIndicator);
    navContainer.appendChild(this.nextButton);
    
    this.container.appendChild(navContainer);
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (!this.isScrollMode) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.previousSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextSlide();
          break;
        case 'Escape':
          e.preventDefault();
          this.toggleScrollMode();
          break;
      }
    });
  }

  toggleScrollMode() {
    this.isScrollMode = !this.isScrollMode;
    
    if (this.isScrollMode) {
      this.container.classList.add('scroll-mode-active');
      this.scrollModeToggle.innerHTML = '通常モード';
      this.scrollModeToggle.classList.add('active');
      this.showSlide(this.currentIndex);
    } else {
      this.container.classList.remove('scroll-mode-active');
      this.scrollModeToggle.innerHTML = '横スクロールモード';
      this.scrollModeToggle.classList.remove('active');
    }
    
    this.updateNavigation();
  }

  showSlide(index) {
    if (index < 0 || index >= this.fields.length) return;
    
    this.currentIndex = index;
    const scrollContainer = document.getElementById('horizontal-scroll-container');
    const slideWidth = 100; // percentage
    
    // トランジション付きで移動
    scrollContainer.style.transform = `translateX(-${index * slideWidth}%)`;
    
    this.updateNavigation();
    this.updateSlideIndicator();
    
    // 現在のスライドのフィールドにフォーカス
    const currentSlide = scrollContainer.children[index];
    const input = currentSlide.querySelector('input, textarea, select');
    if (input) {
      setTimeout(() => input.focus(), 300);
    }
  }

  nextSlide() {
    if (this.currentIndex < this.fields.length - 1) {
      this.showSlide(this.currentIndex + 1);
    }
  }

  previousSlide() {
    if (this.currentIndex > 0) {
      this.showSlide(this.currentIndex - 1);
    }
  }

  updateNavigation() {
    if (!this.isScrollMode) {
      this.prevButton.style.display = 'none';
      this.nextButton.style.display = 'none';
      this.slideIndicator.style.display = 'none';
      return;
    }
    
    this.prevButton.style.display = 'block';
    this.nextButton.style.display = 'block';
    this.slideIndicator.style.display = 'block';
    
    // ボタンの有効/無効状態
    this.prevButton.disabled = this.currentIndex === 0;
    this.nextButton.disabled = this.currentIndex === this.fields.length - 1;
  }

  updateSlideIndicator() {
    this.slideIndicator.textContent = `${this.currentIndex + 1} / ${this.fields.length}`;
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  goToSlide(index) {
    this.showSlide(index);
  }

  syncWithOriginalField(fieldId, value) {
    const originalField = document.getElementById(fieldId);
    if (originalField) {
      originalField.value = value;
      // プログレスバー更新のためにinputイベントを発火
      originalField.dispatchEvent(new Event('input', { bubbles: true }));
      originalField.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  syncCheckboxGroupWithOriginal(fieldId) {
    const scrollCheckboxes = document.querySelectorAll(`#scroll_${fieldId} input[type="checkbox"]`);
    const originalCheckboxes = document.querySelectorAll(`input[name="${fieldId}"]`);
    
    // 元のチェックボックスの状態をクリア
    originalCheckboxes.forEach(cb => cb.checked = false);
    
    // 横スクロール側の状態を元に同期
    scrollCheckboxes.forEach(scrollCb => {
      if (scrollCb.checked) {
        const originalCb = document.querySelector(`input[name="${fieldId}"][value="${scrollCb.value}"]`);
        if (originalCb) {
          originalCb.checked = true;
        }
      }
    });
    
    // その他入力フィールドの同期
    const scrollOtherInput = document.getElementById(`scroll_${fieldId}_other`);
    const originalOtherInput = document.getElementById(`${fieldId}_other`);
    if (scrollOtherInput && originalOtherInput) {
      originalOtherInput.value = scrollOtherInput.value;
      
      // 表示状態も同期
      if (scrollOtherInput.classList.contains('hidden')) {
        originalOtherInput.classList.add('hidden');
      } else {
        originalOtherInput.classList.remove('hidden');
      }
    }
    
    // プログレスバー更新のためにchangeイベントを発火
    originalCheckboxes[0]?.dispatchEvent(new Event('change', { bubbles: true }));
  }

  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}