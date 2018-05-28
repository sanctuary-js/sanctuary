'use strict';

var S = require ('./internal/sanctuary');

var List = require ('./internal/List');
var eq = require ('./internal/eq');


var Cons = List.Cons;
var Nil = List.Nil;


test ('filter', function() {

  eq (typeof S.filter) ('function');
  eq (S.filter.length) (1);
  eq (S.show (S.filter)) ('filter :: Filterable f => (a -> Boolean) -> f a -> f a');

  eq (S.filter (S.odd) ([])) ([]);
  eq (S.filter (S.odd) ([0, 2, 4, 6, 8])) ([]);
  eq (S.filter (S.odd) ([1, 3, 5, 7, 9])) ([1, 3, 5, 7, 9]);
  eq (S.filter (S.odd) ([1, 2, 3, 4, 5])) ([1, 3, 5]);

  eq (S.filter (S.odd) ({})) ({});
  eq (S.filter (S.odd) ({x: 1})) ({x: 1});
  eq (S.filter (S.odd) ({x: 1, y: 2})) ({x: 1});
  eq (S.filter (S.odd) ({x: 1, y: 2, z: 3})) ({x: 1, z: 3});

  eq (S.filter (S.odd) (S.Nothing)) (S.Nothing);
  eq (S.filter (S.odd) (S.Just (0))) (S.Nothing);
  eq (S.filter (S.odd) (S.Just (1))) (S.Just (1));

  eq (S.filter (S.odd) (Nil)) (Nil);
  eq (S.filter (S.odd) (Cons (1) (Nil))) (Cons (1) (Nil));
  eq (S.filter (S.odd) (Cons (1) (Cons (2) (Nil)))) (Cons (1) (Nil));
  eq (S.filter (S.odd) (Cons (1) (Cons (2) (Cons (3) (Nil))))) (Cons (1) (Cons (3) (Nil)));

});
