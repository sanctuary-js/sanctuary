'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('keys', function() {

  eq(typeof S.keys, 'function');
  eq(S.keys.length, 1);
  eq(S.keys.toString(), 'keys :: StrMap a -> Array String');

  eq(S.keys({}), []);
  eq(S.keys({a: 1, b: 2, c: 3}).sort(), ['a', 'b', 'c']);

  var proto = {a: 1, b: 2};
  var obj = Object.create(proto);
  obj.c = 3;
  obj.d = 4;

  eq(S.keys(obj).sort(), ['c', 'd']);

});
