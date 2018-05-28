'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('pairs', function() {

  eq (typeof S.pairs) ('function');
  eq (S.pairs.length) (1);
  eq (S.show (S.pairs)) ('pairs :: StrMap a -> Array (Array2 String a)');

  eq (S.sort (S.pairs ({}))) ([]);
  eq (S.sort (S.pairs ({a: 1, b: 2, c: 3}))) ([['a', 1], ['b', 2], ['c', 3]]);

  var proto = {a: 1, b: 2};
  var obj = Object.create (proto);
  obj.c = 3;
  obj.d = 4;

  eq (S.sort (S.pairs (obj))) ([['c', 3], ['d', 4]]);

});
