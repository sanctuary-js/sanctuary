'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('gte', function() {

  eq(typeof S.gte, 'function');
  eq(S.gte.length, 1);
  eq(S.gte.toString(), 'gte :: Ord a => a -> (a -> Boolean)');

  eq(S.filter(S.gte(3), [1, 2, 3, 4, 5]), [3, 4, 5]);

});
