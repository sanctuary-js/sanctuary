'use strict';

const common = require('sanctuary-style/eslint-common.json');


const indent = JSON.parse(JSON.stringify(common.rules.indent));
indent[2].ignoredNodes.push(
  'FunctionDeclaration[id.name=createSanctuary] > BlockStatement.body'
);

module.exports = {
  root: true,
  extends: ['./node_modules/sanctuary-style/eslint-es3.json'],
  rules: {indent},
};
