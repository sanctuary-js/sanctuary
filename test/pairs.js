'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('pairs', function() {

  function comparePairsAsc(a, b) {
    return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
  }

  eq(typeof S.pairs, 'function');
  eq(S.pairs.length, 1);
  eq(S.pairs.toString(), 'pairs :: StrMap a -> Array (Pair String a)');

  eq(S.pairs({}), []);
  eq(S.pairs({a: 1, b: 2, c: 3}).sort(comparePairsAsc), [['a', 1], ['b', 2], ['c', 3]]);

  var proto = {a: 1, b: 2};
  var obj = Object.create(proto);
  obj.c = 3;
  obj.d = 4;

  eq(S.pairs(obj).sort(comparePairsAsc), [['c', 3], ['d', 4]]);

});
