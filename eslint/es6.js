'use strict';

module.exports = {
  root: true,
  extends: ['../node_modules/sanctuary-style/eslint-es6.json'],
  env: {node: true},
  rules: {
    'func-call-spacing': ['error', 'always', {allowNewlines: true}],
    'indent': require ('./rules/indent'),
    'no-extra-parens': ['off'],
    'no-unexpected-multiline': ['off'],
  },
  overrides: [
    {
      files: ['*.md'],
      plugins: ['markdown'],
      globals: {
        $: false,
        Cons: false,
        Just: false,
        Left: false,
        Nil: false,
        Nothing: false,
        R: false,
        Right: false,
        S: false,
        Sum: false,
        localStorage: false,
        sanctuary: false,
      },
      rules: {
        'array-bracket-spacing': ['off'],
        'indent': ['off'],
        'no-eval': ['off'],
        'no-extra-semi': ['off'],
        'no-unused-vars': ['off'],
        'object-shorthand': ['error', 'always'],
        'prefer-template': ['off'],
        'strict': ['off'],
      },
    },
  ],
};
