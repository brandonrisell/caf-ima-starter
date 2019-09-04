/**
 * Stylistic rules are not enabled, as Prettier is used for formatting
 */
module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    // Implements Airbnb JavaScript Styleguide
    // See:
    // - https://www.npmjs.com/package/eslint-config-airbnb-base
    // - https://github.com/airbnb/javascript
    "airbnb-base",

    // Supresses ESLint formatting rules that conflict with Prettier
    // See: https://github.com/prettier/eslint-config-prettier
    "plugin:prettier/recommended"
  ],
  globals: {
    cast: "readonly",
    chrome: "readonly",
    google: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["prettier"],
  rules: {
    // Formatting violations will cause ESLint to exit with a non-zero
    // code, preventing successful git commit
    "prettier/prettier": ["error"],
    "import/prefer-default-export": false
  }
};
