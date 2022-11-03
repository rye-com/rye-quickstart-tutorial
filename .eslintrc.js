/** @type {import('eslint').Linter.BaseConfig} */
const conf = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'consistent-return': 'error',
    'no-template-curly-in-string': 'warn',
    camelcase: [
      'warn',
      {
        ignoreImports: true,
        properties: 'never',
      },
    ],
    'func-style': ['warn', 'declaration'],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        varsIgnorePattern: '^_',
      },
    ],
  },
  ignorePatterns: ['dist/*'],
};

// Will likely become .cjs when using "type": "module" in package.json.
// Keeping as .js so that `yarn type-check` will type check this file.
module.exports = conf;
