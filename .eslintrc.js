/** @type {import('eslint').Linter.BaseConfig} */
const conf = {
  reportUnusedDisableDirectives: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: [
    'react-app',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
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

    // This rule autofixes tsconfig setting `importsNotUsedAsValues: "error"`
    // This means type-only import statements use the `import type { ... }` syntax
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

    // typescript handles this already:
    '@typescript-eslint/no-unused-vars': ['off'],

    // Disable few rules for .js files, because they can only be fixed with .ts syntax:
    //   https://github.com/typescript-eslint/typescript-eslint/blob/6c3816b3831e6e683c1a7842196b34248803d69b/packages/eslint-plugin/docs/rules/explicit-function-return-type.md#configuring-in-a-mixed-jsts-codebase
    //   These are enabled specifically for TS in `overrides` below.
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ['*.ts', '*.tsx'],
      rules: {
        // Getting ton of errors for these rules:
        // '@typescript-eslint/explicit-function-return-type': ['error'],
        // '@typescript-eslint/explicit-module-boundary-types': ['error'],
        '@typescript-eslint/no-var-requires': ['error'],
      },
    },
  ],
  ignorePatterns: ['dist/*'],
};

// Will likely become .cjs when using "type": "module" in package.json.
// Keeping as .js so that `yarn type-check` will type check this file.
module.exports = conf;
