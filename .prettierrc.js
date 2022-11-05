const tailwindPlugin = require('prettier-plugin-tailwindcss');

// Type-check prettier config:
/** @type {import("prettier").Config} */
const conf = {
  // Used in other projects, could be abstracted into common settings config
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,

  // Avoid even more merge conflicts: https://prettier.io/blog/2020/03/21/2.0.0.html#change-default-value-for-trailingcomma-to-es5-6963httpsgithubcomprettierprettierpull6963-by-fiskerhttpsgithubcomfisker
  trailingComma: 'all',

  // TODO: explicitly specify all prettier config options here
  // This means no matter how prettier runs on this project,
  // the settings will be correct.

  // Sort tailwind classnames: https://github.com/tailwindlabs/prettier-plugin-tailwindcss
  plugins: [tailwindPlugin],
  tailwindConfig: './tailwind.config.js',
};

module.exports = conf;
