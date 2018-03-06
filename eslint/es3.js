'use strict';

module.exports = {
  root: true,
  extends: ['../node_modules/sanctuary-style/eslint-es3.json'],
  rules: {
    'func-call-spacing': ['error', 'always', {allowNewlines: true}],
    'indent': require ('./rules/indent'),
    'no-extra-parens': ['off'],
    'no-unexpected-multiline': ['off'],
  },
};
