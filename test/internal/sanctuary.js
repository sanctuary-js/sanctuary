'use strict';

const $ = require ('sanctuary-def');

const S = require ('../..');

const List = require ('./List');
const Sum = require ('./Sum');


//    env :: Array Type
const env = S.env.concat ([
  List.Type ($.Unknown),
  Sum.Type,
]);

module.exports = S.create ({checkTypes: true, env});
