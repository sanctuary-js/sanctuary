'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('unfoldr', function() {

  eq (typeof S.unfoldr) ('function');
  eq (S.unfoldr.length) (1);
  eq (S.show (S.unfoldr)) ('unfoldr :: (b -> Maybe (Array2 a b)) -> b -> Array a');

  function f(n) {
    return n >= 5 ? S.Nothing : S.Just ([n, n + 1]);
  }
  eq (S.unfoldr (f) (5)) ([]);
  eq (S.unfoldr (f) (4)) ([4]);
  eq (S.unfoldr (f) (1)) ([1, 2, 3, 4]);

});
