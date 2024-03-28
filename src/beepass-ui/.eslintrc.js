// Workaround for https://github.com/eslint/eslint/issues/3458
const path = require("path");
require("@rushstack/eslint-patch/modern-module-resolution");

const eslintConfig = {
  extends: [
    "@asl-19/eslint-config",
    "@asl-19/eslint-config/react",
    "@asl-19/eslint-config/typescript",
    "plugin:jest-dom/recommended",
    "plugin:testing-library/react",
  ],

  // Force ESLint to use the file in the current directory
  parserOptions: {
    createDefaultProgram: true,
    project: path.join(__dirname, "tsconfig.json"),
  },

  plugins: ["react-memo", "sort-keys-fix"],

  // Stop ESLint from loading root ../../.eslintrc.json
  root: true,
  // since baseUrl in the tsconfig file doesn't work, disabled noRestrictedImports now.
  rules: {
    "@emotion/syntax-preference": ["warn", "string"],

    // TODO: Remove this override and fix the warnings:
    "@typescript-eslint/no-namespace": "off",

    "no-restricted-globals": [
      "error",
      {
        message:
          "Import cordova from src/utils/cordova instead (so the implementation is mocked in cordova-mock builds).",
        name: "cordova",
      },
    ],

    "no-restricted-imports": ["off"],
    // "tsdoc/syntax": "off",
    // TODO: Remove this override and fix the warnings:
    "react-memo/require-usememo": "off",
    "sort-keys-fix/sort-keys-fix": [
      "warn",
      "asc",
      {
        caseSensitive: false,
        natural: true,
      },
    ],
  },

  /* eslint-disable sort-keys-fix/sort-keys-fix */
  overrides: [
    // Via https://github.com/ASL-19/eslint-config/blob/82671b80a107dd6d580a2b507e171552d0db31b2/index.js#L57-L62
    // (Shared config missing create-react-app "setupTests.js" in files array)
    {
      files: ["**/*.test.ts", "**/*.test.tsx", "setupTests.js"],
      env: {
        jest: true,
      },
      rules: {
        // Avoid forgetting to await UserEvent methods and testRender() calls
        "@typescript-eslint/no-floating-promises": "warn",
      },
    },
    {
      // This must be kept in sync with .stylelintignore
      files: [
        "./src/components/OnboardingPage/**/*",
        "./src/components/PermissionDialog/**/*",
      ],
      rules: {
        "@emotion/syntax-preference": ["warn", "object"],
      },
    },
  ],
  /* eslint-enable sort-keys-fix/sort-keys-fix */
};

module.exports = eslintConfig;
