module.exports = {
    root: true,
    env: {
      node: true
    },
    extends: ["plugin:vue/essential"],
    parserOptions: {
      parser: "babel-eslint"
    },
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      quotes: [1, "double"], // 引号类型 `` "" ''
      semi: 0,
      "space-before-function-paren": 0,
      eqeqeq: ["off"],
      "no-unused-vars": 'off'
    },
    overrides: [
      {
        files: [
          "**/__tests__/*.{j,t}s?(x)",
          "**/tests/unit/**/*.spec.{j,t}s?(x)"
        ],
        env: {
          jest: true
        }
      }
    ]
}