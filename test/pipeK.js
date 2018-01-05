'use strict';

var S = require('./internal/sanctuary');

var List = require('./internal/List');
var eq = require('./internal/eq');


var Cons = List.Cons;
var Nil = List.Nil;


test('pipeK', function() {

  eq(typeof S.pipeK, 'function');
  eq(S.pipeK.length, 2);
  eq(S.pipeK.toString(), 'pipeK :: (Foldable f, Chain m) => f (Any -> m Any) -> m a -> m b');

  eq(S.pipeK([], S.Just([1, 2, 3])), S.Just([1, 2, 3]));
  eq(S.pipeK([S.tail], S.Just([1, 2, 3])), S.Just([2, 3]));
  eq(S.pipeK([S.tail, S.tail], S.Just([1, 2, 3])), S.Just([3]));
  eq(S.pipeK([S.tail, S.tail, S.head], S.Just([1, 2, 3])), S.Just(3));

  eq(S.pipeK(Nil, S.Just([1, 2, 3])), S.Just([1, 2, 3]));
  eq(S.pipeK(Cons(S.tail, Nil), S.Just([1, 2, 3])), S.Just([2, 3]));
  eq(S.pipeK(Cons(S.tail, Cons(S.tail, Nil)), S.Just([1, 2, 3])), S.Just([3]));
  eq(S.pipeK(Cons(S.tail, Cons(S.tail, Cons(S.head, Nil))), S.Just([1, 2, 3])), S.Just(3));

});
