module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "padding-line-between-statements": [2,
      {
        "blankLine": "always",
        "next": "*",
        "prev": ["const", "let", "var"]
      },
      {
        "blankLine": "any",
        "next": ["const", "let", "var"],
        "prev": ["const", "let", "var"]
      },
      {
        "blankLine": "always",
        "next": "*",
        "prev": "directive"
      },
      {
        "blankLine": "any",
        "next": "directive",
        "prev": "directive"
      },
      {
        "blankLine": "always",
        "next": "return",
        "prev": "*"
      }
    ],
    "semi": [2, "always"],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
