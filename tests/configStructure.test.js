// configStructure.test.js - フォーム設定のデータ構造テスト

import { formConfig } from '../modules/forms/config.js';

describe('Form Configuration Structure Tests', () => {
  const validSizes = ['small', 'medium', 'large'];
  const validDisplayWidths = ['auto', 'full'];
  const validFieldTypes = ['text', 'textarea', 'select', 'date', 'checkbox-group'];

  // 各フォーム設定の基本構造をテスト
  Object.keys(formConfig).forEach(formKey => {
    const form = formConfig[formKey];
    
    describe(`${formKey} form configuration`, () => {
      test('should have required properties', () => {
        expect(form).toHaveProperty('id');
        expect(form).toHaveProperty('title');
        expect(form).toHaveProperty('formTitle');
        
        if (!form.isSpecial) {
          expect(form).toHaveProperty('fields');
          expect(Array.isArray(form.fields)).toBe(true);
        }
      });

      if (!form.isSpecial && form.fields) {
        form.fields.forEach((field, index) => {
          describe(`field ${index + 1} (${field.id})`, () => {
            test('should have required field properties', () => {
              expect(field).toHaveProperty('id');
              expect(field).toHaveProperty('label');
              expect(field).toHaveProperty('type');
              expect(validFieldTypes).toContain(field.type);
            });

            test('should have consistent size attribute', () => {
              if (field.size) {
                expect(validSizes).toContain(field.size);
              }
            });

            test('should have valid displayWidth', () => {
              if (field.displayWidth) {
                expect(validDisplayWidths).toContain(field.displayWidth);
              }
            });

            test('should have appropriate maxLength for text inputs', () => {
              if (field.type === 'text' || field.type === 'textarea') {
                if (field.maxLength) {
                  expect(typeof field.maxLength).toBe('number');
                  expect(field.maxLength).toBeGreaterThan(0);
                }
              }
            });

            test('should have rows property for textarea', () => {
              if (field.type === 'textarea' && field.rows) {
                expect(typeof field.rows).toBe('number');
                expect(field.rows).toBeGreaterThan(0);
              }
            });

            test('should have options for select and checkbox-group', () => {
              if (field.type === 'select' || field.type === 'checkbox-group') {
                expect(field).toHaveProperty('options');
                expect(Array.isArray(field.options)).toBe(true);
                expect(field.options.length).toBeGreaterThan(0);
                
                field.options.forEach(option => {
                  expect(option).toHaveProperty('value');
                  expect(option).toHaveProperty('label');
                });
              }
            });
          });
        });
      }
    });
  });

  // サイズ属性の一貫性テスト
  describe('Size attribute consistency', () => {
    test('all fields should have size attributes', () => {
      Object.keys(formConfig).forEach(formKey => {
        const form = formConfig[formKey];
        if (!form.isSpecial && form.fields) {
          form.fields.forEach(field => {
            if (field.type !== 'checkbox-group') {
              expect(field).toHaveProperty('size');
              expect(validSizes).toContain(field.size);
            }
          });
        }
      });
    });

    test('size and maxLength should be logically consistent', () => {
      Object.keys(formConfig).forEach(formKey => {
        const form = formConfig[formKey];
        if (!form.isSpecial && form.fields) {
          form.fields.forEach(field => {
            if (field.size && field.maxLength) {
              // Small fields should have shorter maxLength
              if (field.size === 'small') {
                expect(field.maxLength).toBeLessThanOrEqual(100);
              }
              // Large fields can have longer maxLength
              if (field.size === 'large') {
                expect(field.maxLength).toBeGreaterThanOrEqual(100);
              }
            }
          });
        }
      });
    });
  });

  // データ構造の完全性テスト
  describe('Data structure completeness', () => {
    test('all text/textarea fields should have proper attributes', () => {
      Object.keys(formConfig).forEach(formKey => {
        const form = formConfig[formKey];
        if (!form.isSpecial && form.fields) {
          form.fields.forEach(field => {
            if (field.type === 'text' || field.type === 'textarea') {
              expect(field).toHaveProperty('placeholder');
              expect(field).toHaveProperty('size');
              expect(field).toHaveProperty('displayWidth');
              expect(field).toHaveProperty('maxLength');
              
              if (field.type === 'textarea') {
                expect(field).toHaveProperty('rows');
              }
            }
          });
        }
      });
    });

    test('all select fields should have size attributes', () => {
      Object.keys(formConfig).forEach(formKey => {
        const form = formConfig[formKey];
        if (!form.isSpecial && form.fields) {
          form.fields.forEach(field => {
            if (field.type === 'select') {
              expect(field).toHaveProperty('size');
              expect(field).toHaveProperty('displayWidth');
            }
          });
        }
      });
    });
  });
});