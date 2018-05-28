'use strict';

var S = require ('./internal/sanctuary');

var List = require ('./internal/List');
var eq = require ('./internal/eq');
var map = require ('./internal/map');


var Cons = List.Cons;
var Nil = List.Nil;


test ('flip', function() {

  eq (typeof S.flip) ('function');
  eq (S.flip.length) (1);
  eq (S.show (S.flip)) ('flip :: Functor f => f (a -> b) -> a -> f b');

  eq (S.flip (S.concat) ('foo') ('bar')) ('barfoo');
  eq (map (S.flip (S.concat) ('!')) (['BAM', 'POW', 'KA-POW'])) (['BAM!', 'POW!', 'KA-POW!']);
  eq (S.flip ([Math.floor, Math.ceil]) (1.5)) ([1, 2]);
  eq (S.flip ({floor: Math.floor, ceil: Math.ceil}) (1.5)) ({floor: 1, ceil: 2});
  eq (S.flip (Cons (Math.floor) (Cons (Math.ceil) (Nil))) (1.5)) (Cons (1) (Cons (2) (Nil)));

});
