'use strict';

var $ = require('sanctuary-def');

var S = require('../..');


//  UnaryType :: String -> Type
function UnaryType(typeIdent) {
  return $.UnaryType(
    typeIdent,
    '',
    function(x) { return S.type(x) === typeIdent; },
    function(v) { return [v.value]; }
  )($.Unknown);
}

//  env :: Array Type
var env = S.env.concat([
  UnaryType('sanctuary/Compose'),
  UnaryType('sanctuary/Identity')
]);

module.exports = S.create({checkTypes: true, env: env});
