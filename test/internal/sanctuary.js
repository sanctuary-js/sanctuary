'use strict';

var $ = require ('sanctuary-def');
var type = require ('sanctuary-type-identifiers');

var S = require ('../..');

var List = require ('./List');
var Sum = require ('./Sum');


//  UnaryType :: String -> Type
function UnaryType(typeIdent) {
  return $.UnaryType
    (typeIdent)
    ('')
    (function(x) { return type (x) === typeIdent; })
    (function(v) { return [v.value]; })
    ($.Unknown);
}

//  UselessType :: Type
var UselessType = $.NullaryType
  ('sanctuary/Useless')
  ('')
  (function(x) { return type (x) === 'sanctuary/Useless'; });

//  env :: Array Type
var env = S.env.concat ([
  UnaryType ('sanctuary/Compose'),
  UnaryType ('sanctuary/Identity'),
  List.Type ($.Unknown),
  Sum.Type,
  UselessType
]);

module.exports = S.create ({checkTypes: true, env: env});
