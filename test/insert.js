'use strict';

var jsc = require ('jsverify');

var S = require ('..');

var eq = require ('./internal/eq');
var equals = require ('./internal/equals');


test ('insert', function() {

  eq (typeof S.insert) ('function');
  eq (S.insert.length) (1);
  eq (String (S.insert)) ('insert :: String -> a -> StrMap a -> StrMap a');

  eq (S.insert ('a') (1) ({})) ({a: 1});
  eq (S.insert ('b') (2) ({a: 1})) ({a: 1, b: 2});
  eq (S.insert ('c') (3) ({a: 1, b: 2, c: 4})) ({a: 1, b: 2, c: 3});

  jsc.assert (jsc.forall (jsc.string, jsc.number, jsc.dict (jsc.number), function(key, val, map) {
    var insert = S.insert (key) (val);
    var lhs = insert (insert (map));
    var rhs = insert (map);
    return equals (lhs) (rhs);
  }), {tests: 1000});

});
