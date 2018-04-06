'use strict';

const common = require ('sanctuary-style/eslint-common.json');


const indent = (JSON.parse (JSON.stringify (common))).rules['indent'];
indent[2].ignoredNodes.push (
  'CallExpression',
  'CallExpression > *',
  'CallExpression > ArrowFunctionExpression ArrowFunctionExpression > *',
  'CallExpression > FunctionExpression > BlockStatement'
);
module.exports = indent;
