'use strict';

var jsc = require('jsverify');

var S = require('..');

var eq = require('./internal/eq');


test('insert', function() {

  eq(typeof S.insert, 'function');
  eq(S.insert.length, 3);
  eq(S.insert.toString(), 'insert :: String -> a -> StrMap a -> StrMap a');

  eq(S.insert('a', 1, {}), {a: 1});
  eq(S.insert('b', 2, {a: 1}), {a: 1, b: 2});
  eq(S.insert('c', 3, {a: 1, b: 2, c: 4}), {a: 1, b: 2, c: 3});

  jsc.assert(jsc.forall(jsc.string, jsc.number, jsc.dict(jsc.number), function(key, val, map) {
    var insert = S.insert(key, val);
    return S.equals(insert(insert(map)), insert(map));
  }), {tests: 1000});

});
