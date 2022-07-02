module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    rules: {
      // 利用者(export先)はテストコードだけで, 正直面倒くさいので切る
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  };
  