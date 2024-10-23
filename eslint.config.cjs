module.exports = [
  {
    ignores: ["node_modules/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-underscore-dangle": ["error", { allow: ["_id"] }],
      "no-console": "off",
    },
  },
];
