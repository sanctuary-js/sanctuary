'use strict';

const $ = require ('sanctuary-def');
const type = require ('sanctuary-type-identifiers');

const S = require ('../..');

const List = require ('./List');
const Sum = require ('./Sum');


//    UnaryType :: String -> Type
const UnaryType = typeIdent =>
  $.UnaryType (typeIdent)
              ('')
              (x => type (x) === typeIdent)
              (v => [v.value])
              ($.Unknown);

//    env :: Array Type
const env = S.env.concat ([
  UnaryType ('sanctuary/Compose'),
  UnaryType ('sanctuary-identity/Identity@1'),
  List.Type ($.Unknown),
  Sum.Type,
]);

module.exports = S.create ({checkTypes: true, env: env});
