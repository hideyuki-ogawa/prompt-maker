/**
 * クリア機能のテスト
 * 
 * テスト対象機能:
 * 1. 基本的なフィールドクリア
 * 2. 保護チェックボックス機能
 * 3. チェックボックスグループのクリア
 * 4. 「その他」フィールドの特別処理
 * 5. プロンプト表示のクリア
 * 6. エラーハンドリング
 */

const { 
  createMockDOM, 
  createClearFunction, 
  createMockElement, 
  createMockFormConfig 
} = require('./testHelpers');

// テスト環境のセットアップ
createMockDOM();

describe('クリア機能のテスト', () => {
  let mockElements;
  let mockFormConfig;
  let mockShowToast;
  let executeClear;
  let testDependencies;
  
  beforeEach(() => {
    // モック初期化
    mockShowToast = jest.fn();
    mockFormConfig = createMockFormConfig();
    mockElements = {
      promptOutputDiv: createMockElement('div', { textContent: 'テストプロンプト' })
    };
    
    // テスト用の依存関係
    testDependencies = {
      currentTab: 'email',
      formConfig: mockFormConfig,
      elements: mockElements,
      showToast: mockShowToast
    };
    
    // クリア関数を作成
    executeClear = createClearFunction(testDependencies);
    
    jest.clearAllMocks();
  });

  describe('基本的なクリア機能', () => {
    test('テキストフィールドが正しくクリアされること', () => {
      // セットアップ
      const mockTextField = createMockElement('input', { value: 'テスト内容' });
      const mockProtectCheckbox = createMockElement('input', { checked: false });
      
      document.getElementById = jest.fn((id) => {
        if (id === 'email_to_info') return mockTextField;
        if (id === 'protect_email_to_info') return mockProtectCheckbox;
        return null;
      });
      
      // テスト対象の関数を実行
      executeClear();
      
      // 結果の検証
      expect(mockTextField.value).toBe('');
      expect(mockShowToast).toHaveBeenCalledWith('1個のフィールドをクリアしました。');
    });

    test('テキストエリアが正しくクリアされること', () => {
      const mockTextarea = createMockElement('textarea', { value: '複数行\nテキスト' });
      const mockProtectCheckbox = createMockElement('input', { checked: false });
      
      document.getElementById = jest.fn((id) => {
        if (id === 'email_main_points') return mockTextarea;
        if (id === 'protect_email_main_points') return mockProtectCheckbox;
        return null;
      });
      
      executeClear();
      
      expect(mockTextarea.value).toBe('');
    });

    test('空のフィールドはカウントされないこと', () => {
      const mockTextField = createMockElement('input', { value: '' });
      const mockProtectCheckbox = createMockElement('input', { checked: false });
      
      document.getElementById = jest.fn((id) => {
        if (id === 'email_to_info') return mockTextField;
        if (id === 'protect_email_to_info') return mockProtectCheckbox;
        return null;
      });
      
      executeClear();
      
      expect(mockShowToast).toHaveBeenCalledWith('クリアするフィールドがありませんでした。', true);
    });
  });

  describe('保護機能のテスト', () => {
    test('保護されたフィールドはクリアされないこと', () => {
      const mockTextField = createMockElement('input', { value: '保護されたテキスト' });
      const mockProtectCheckbox = createMockElement('input', { checked: true });
      
      document.getElementById = jest.fn((id) => {
        if (id === 'email_to_info') return mockTextField;
        if (id === 'protect_email_to_info') return mockProtectCheckbox;
        return null;
      });
      
      executeClear();
      
      expect(mockTextField.value).toBe('保護されたテキスト');
      expect(mockShowToast).toHaveBeenCalledWith('クリアするフィールドがありませんでした。', true);
    });

    test('保護されていないフィールドはクリアされること', () => {
      const mockTextField = createMockElement('input', { value: '保護されていないテキスト' });
      const mockProtectCheckbox = createMockElement('input', { checked: false });
      
      document.getElementById = jest.fn((id) => {
        if (id === 'email_to_info') return mockTextField;
        if (id === 'protect_email_to_info') return mockProtectCheckbox;
        return null;
      });
      
      executeClear();
      
      expect(mockTextField.value).toBe('');
    });
  });

  describe('チェックボックスグループのテスト', () => {
    test('保護されていないチェックボックスグループがクリアされること', () => {
      const mockCheckboxes = [
        createMockElement('input', { checked: true }),
        createMockElement('input', { checked: false }),
        createMockElement('input', { checked: true })
      ];
      const mockProtectCheckbox = createMockElement('input', { checked: false });
      
      document.getElementById = jest.fn((id) => {
        if (id === 'protect_email_purpose') return mockProtectCheckbox;
        return null;
      });
      
      document.querySelectorAll = jest.fn((selector) => {
        if (selector === 'input[name="email_purpose"]') return mockCheckboxes;
        return [];
      });
      
      executeClear();
      
      mockCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
          expect(checkbox.checked).toBe(false);
        }
      });
    });

    test('保護されたチェックボックスグループはクリアされないこと', () => {
      const mockCheckboxes = [
        createMockElement('input', { checked: true }),
        createMockElement('input', { checked: true })
      ];
      const mockProtectCheckbox = createMockElement('input', { checked: true });
      
      document.getElementById = jest.fn((id) => {
        if (id === 'protect_email_purpose') return mockProtectCheckbox;
        return null;
      });
      
      document.querySelectorAll = jest.fn((selector) => {
        if (selector === 'input[name="email_purpose"]') return mockCheckboxes;
        return [];
      });
      
      executeClear();
      
      mockCheckboxes.forEach(checkbox => {
        expect(checkbox.checked).toBe(true);
      });
    });
  });

  describe('「その他」フィールドの特別処理テスト', () => {
    test('「その他」フィールドは常にクリアされること', () => {
      const mockOtherInput = createMockElement('input', { 
        value: 'その他のテキスト',
        classList: { 
          add: jest.fn(),
          remove: jest.fn(),
          contains: jest.fn(() => false)
        }
      });
      const mockProtectCheckbox = createMockElement('input', { checked: true }); // 保護されていても
      
      document.getElementById = jest.fn((id) => {
        if (id === 'email_purpose_other') return mockOtherInput;
        if (id === 'protect_email_purpose') return mockProtectCheckbox;
        return null;
      });
      
      document.querySelectorAll = jest.fn(() => []);
      
      executeClear();
      
      expect(mockOtherInput.value).toBe('');
      expect(mockOtherInput.classList.add).toHaveBeenCalledWith('hidden');
    });

    test('空の「その他」フィールドは処理されないこと', () => {
      const mockOtherInput = createMockElement('input', { value: '' });
      
      document.getElementById = jest.fn((id) => {
        if (id === 'email_purpose_other') return mockOtherInput;
        return null;
      });
      
      executeClear();
      
      expect(mockOtherInput.classList.add).not.toHaveBeenCalled();
    });
  });

  describe('プロンプト表示クリアのテスト', () => {
    test('プロンプト表示が初期状態にリセットされること', () => {
      mockElements.promptOutputDiv.textContent = '生成されたプロンプト内容';
      
      executeClear();
      
      expect(mockElements.promptOutputDiv.textContent).toBe('ここにプロンプトが表示されます...');
    });
  });

  describe('エラーハンドリングとエッジケース', () => {
    test('feedbackタブではクリア機能が無効になること', () => {
      testDependencies.currentTab = 'feedback';
      const feedbackExecuteClear = createClearFunction(testDependencies);
      
      feedbackExecuteClear();
      
      expect(mockShowToast).toHaveBeenCalledWith('フィードバックタブではクリア機能は利用できません。', true);
    });

    test('存在しないタブの設定でエラーにならないこと', () => {
      testDependencies.currentTab = 'nonexistent';
      testDependencies.formConfig = {};
      const nonexistentExecuteClear = createClearFunction(testDependencies);
      
      nonexistentExecuteClear();
      
      // エラーが発生せず、適切に処理されることを確認
      expect(mockShowToast).toHaveBeenCalledWith('クリアするフィールドがありませんでした。', true);
    });

    test('DOM要素が存在しない場合でもエラーにならないこと', () => {
      document.getElementById = jest.fn(() => null);
      document.querySelectorAll = jest.fn(() => []);
      
      executeClear();
      
      expect(mockShowToast).toHaveBeenCalledWith('クリアするフィールドがありませんでした。', true);
    });

    test('保護チェックボックスが存在しない場合でも動作すること', () => {
      const mockTextField = createMockElement('input', { value: 'テスト' });
      
      document.getElementById = jest.fn((id) => {
        if (id === 'email_to_info') return mockTextField;
        return null; // 保護チェックボックスが存在しない
      });
      
      executeClear();
      
      expect(mockTextField.value).toBe('');
    });
  });

  describe('複合シナリオのテスト', () => {
    test('複数フィールドの混合クリア処理', () => {
      const mockTextField = createMockElement('input', { value: 'テキスト' });
      const mockProtectedField = createMockElement('input', { value: '保護されたテキスト' });
      const mockCheckboxes = [createMockElement('input', { checked: true })];
      const mockOtherInput = createMockElement('input', { value: 'その他' });
      
      const mockProtectText = createMockElement('input', { checked: false });
      const mockProtectProtected = createMockElement('input', { checked: true });
      const mockProtectCheckbox = createMockElement('input', { checked: false });
      
      document.getElementById = jest.fn((id) => {
        if (id === 'email_to_info') return mockTextField;
        if (id === 'email_main_points') return mockProtectedField;
        if (id === 'email_purpose_other') return mockOtherInput;
        if (id === 'protect_email_to_info') return mockProtectText;
        if (id === 'protect_email_main_points') return mockProtectProtected;
        if (id === 'protect_email_purpose') return mockProtectCheckbox;
        return null;
      });
      
      document.querySelectorAll = jest.fn((selector) => {
        if (selector === 'input[name="email_purpose"]') return mockCheckboxes;
        return [];
      });
      
      // フォーム設定を更新
      testDependencies.formConfig.email.fields = [
        { id: 'email_purpose', type: 'checkbox-group' },
        { id: 'email_to_info', type: 'text' },
        { id: 'email_main_points', type: 'textarea' }
      ];
      
      const complexExecuteClear = createClearFunction(testDependencies);
      complexExecuteClear();
      
      // 保護されていないフィールドがクリアされることを確認
      expect(mockTextField.value).toBe('');
      expect(mockCheckboxes[0].checked).toBe(false);
      expect(mockOtherInput.value).toBe('');
      
      // 保護されたフィールドはそのまま
      expect(mockProtectedField.value).toBe('保護されたテキスト');
      
      expect(mockShowToast).toHaveBeenCalledWith('3個のフィールドをクリアしました。');
    });
  });
});