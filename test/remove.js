'use strict';

var jsc = require ('jsverify');

var S = require ('..');

var eq = require ('./internal/eq');
var equals = require ('./internal/equals');


test ('remove', function() {

  eq (typeof S.remove) ('function');
  eq (S.remove.length) (1);
  eq (String (S.remove)) ('remove :: String -> StrMap a -> StrMap a');

  eq (S.remove ('a') ({})) ({});
  eq (S.remove ('b') ({a: 1})) ({a: 1});
  eq (S.remove ('c') ({a: 1, b: 2, c: 3})) ({a: 1, b: 2});

  jsc.assert (jsc.forall (jsc.string, jsc.dict (jsc.number), function(key, map) {
    var remove = S.remove (key);
    var lhs = remove (remove (map));
    var rhs = remove (map);
    return equals (lhs) (rhs);
  }), {tests: 1000});

});
