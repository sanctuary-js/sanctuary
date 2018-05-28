'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('keys', function() {

  eq (typeof S.keys) ('function');
  eq (S.keys.length) (1);
  eq (S.show (S.keys)) ('keys :: StrMap a -> Array String');

  eq (S.sort (S.keys ({}))) ([]);
  eq (S.sort (S.keys ({a: 1, b: 2, c: 3}))) (['a', 'b', 'c']);

  var proto = {a: 1, b: 2};
  var obj = Object.create (proto);
  obj.c = 3;
  obj.d = 4;

  eq (S.sort (S.keys (obj))) (['c', 'd']);

});
