const { defineConfig } = require("eslint-define-config")


module.exports = defineConfig({
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2021,
    },
    plugins: ["@typescript-eslint", "import"],
    rules: {
        quotes: ["error", "double"],
        semi: ["error", "never"],
        "no-debugger": ["error"],
        "no-empty": ["warn", { allowEmptyCatch: true }],
        "no-useless-escape": "off",
        "sort-imports": 0,
        "import/order": [2, { alphabetize: { order: "asc" } }],
        "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    },
})
