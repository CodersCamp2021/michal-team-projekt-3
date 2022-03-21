module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  env: {
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  plugins: ['prettier', 'jest'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
    ],
  },
  overrides: [
    {
      files: ['**/__mocks__/*.js'],
      rules: {
        'no-unused-vars': 'off',
      },
    },
  ],
};
