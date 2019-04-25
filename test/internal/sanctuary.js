'use strict';

const $ = require ('sanctuary-def');
const type = require ('sanctuary-type-identifiers');

const S = require ('../..');

const List = require ('./List');
const Sum = require ('./Sum');


//    UnaryType :: String -> String -> Type
const UnaryType = name => typeIdent =>
  $.UnaryType (typeIdent)
              ('')
              ([])
              (x => type (x) === typeIdent)
              (v => [v.value])
              ($.Unknown);

//    env :: Array Type
const env = S.env.concat ([
  UnaryType ('Compose') ('sanctuary/Compose'),
  List.Type ($.Unknown),
  Sum.Type,
]);

module.exports = S.create ({checkTypes: true, env});
