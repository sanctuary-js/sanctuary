'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('pairs', function() {

  var comparePairsAsc = function(a, b) {
    return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
  };

  eq(typeof S.pairs, 'function');
  eq(S.pairs.length, 1);

  throws(function() { S.pairs('xxx'); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'pairs :: StrMap a -> Array (Pair String a)\n' +
                 '         ^^^^^^^^\n' +
                 '            1\n' +
                 '\n' +
                 '1)  "xxx" :: String\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘StrMap a’.\n'));

  throws(function() { S.pairs({a: '1', b: 2, c: '3'}); },
         errorEq(TypeError,
                 'Type-variable constraint violation\n' +
                 '\n' +
                 'pairs :: StrMap a -> Array (Pair String a)\n' +
                 '                ^\n' +
                 '                1\n' +
                 '\n' +
                 '1)  "1" :: String\n' +
                 '    2 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                 '    "3" :: String\n' +
                 '\n' +
                 'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n'));

  eq(S.pairs({}), []);
  eq(S.pairs({a: 1, b: 2, c: 3}).sort(comparePairsAsc), [['a', 1], ['b', 2], ['c', 3]]);

  var proto = {a: 1, b: 2};
  var obj = Object.create(proto);
  obj.c = 3;
  obj.d = 4;

  eq(S.pairs(obj).sort(comparePairsAsc), [['c', 3], ['d', 4]]);

});
