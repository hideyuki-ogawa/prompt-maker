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
      }
      
      if (inputElement) {
        // 元のフィールドと同期
        inputElement.addEventListener('input', () => this.syncWithOriginalField(field.id, inputElement.value));
        inputElement.addEventListener('change', () => this.syncWithOriginalField(field.id, inputElement.value));
        
        // 元のフィールドの値を取得して設定
        const originalField = document.getElementById(field.id);
        if (originalField && originalField.value) {
          inputElement.value = originalField.value;
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

  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}