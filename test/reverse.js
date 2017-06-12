'use strict';

var S = require('./internal/sanctuary');

var List = require('./internal/List');
var eq = require('./internal/eq');


var Cons = List.Cons;
var Nil = List.Nil;


test('reverse', function() {

  eq(typeof S.reverse, 'function');
  eq(S.reverse.length, 1);
  eq(S.reverse.toString(), 'reverse :: (Applicative f, Foldable f, Monoid f) => f a -> f a');

  eq(S.reverse([]), []);
  eq(S.reverse([1]), [1]);
  eq(S.reverse([1, 2]), [2, 1]);
  eq(S.reverse([1, 2, 3]), [3, 2, 1]);

  eq(S.reverse(Nil), Nil);
  eq(S.reverse(Cons(1, Nil)), Cons(1, Nil));
  eq(S.reverse(Cons(1, Cons(2, Nil))), Cons(2, Cons(1, Nil)));
  eq(S.reverse(Cons(1, Cons(2, Cons(3, Nil)))), Cons(3, Cons(2, Cons(1, Nil))));

});
