// @ts-check
// eslint.config.mjs
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/*', 'src/main.ts'], // Игнорируем файл самого линтера
  },
  eslint.configs.recommended, // Базовые рекомендации ESLint
  ...tseslint.configs.strict, // Включаем строгие правила TypeScript
  eslintPluginPrettierRecommended, // Интеграция Prettier через ESLint
  {
    languageOptions: {
      globals: {
        ...globals.node, // Глобальные переменные Node.js
        ...globals.jest, // Глобальные переменные Jest
      },
      ecmaVersion: 2022, // Современный стандарт ECMAScript
      sourceType: 'module', // Поддержка ES-модулей
      parserOptions: {
        project: './tsconfig.json', // Указываем файл TypeScript
        tsconfigRootDir: import.meta.dirname, // Корневая директория
      },
    },
  },
  {
    rules: {
      // === Prettier ===
      'prettier/prettier': [
        'error', // Ошибка при нарушении формата
        {
          endOfLine: 'lf', // Использовать LF вместо CRLF
        },
      ],

      // === TypeScript ===
      '@typescript-eslint/no-explicit-any': 'error', // Запрещаем any
      '@typescript-eslint/no-floating-promises': 'error', // Запрещаем необработанные промисы
      '@typescript-eslint/no-unsafe-argument': 'error', // Запрещаем небезопасные аргументы
      '@typescript-eslint/no-non-null-assertion': 'error', // Запрещаем оператор `!`
      '@typescript-eslint/explicit-function-return-type': 'off', // Обязательный тип возврата
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ], // Предупреждение о неиспользуемых переменных (игнор _)
      '@typescript-eslint/strict-boolean-expressions': 'error', // Строгие выражения для boolean
      '@typescript-eslint/no-inferrable-types': 'error', // Запрещаем явно указывать инферируемые типы
      '@typescript-eslint/no-extraneous-class': 'off',
      // === Общие правила ESLint ===
      'no-console': 'warn', // Консольные логи разрешены только как предупреждения
      'no-debugger': 'error', // Запрещаем debugger
      eqeqeq: ['error', 'always'], // Использование только строгих сравнений (===)
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message: 'for-in запрещен, используйте Object.keys()',
        },
        {
          selector: 'WithStatement',
          message: 'with запрещен',
        },
      ],
      'prefer-const': 'error', // Всегда использовать const, если возможно
      'no-var': 'error', // Запрещаем var
      'prefer-arrow-callback': 'error', // Предпочтение стрелочных функций
      'arrow-body-style': ['error', 'as-needed'], // Упрощение тела стрелочных функций
    },
  },
);
