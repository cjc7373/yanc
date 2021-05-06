module.exports = {
    env: {
        es2021: true,
        browser: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        "plugin:@typescript-eslint/recommended",
    ],
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
    },
    ignorePatterns: ["**/dist/**"],
    rules: {
        // override/add rules settings here, such as:
        // 'vue/no-unused-vars': 'error'
        'vue/html-indent': ['warn', 4],
    }
}