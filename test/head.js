'use strict';

const S = require ('./internal/sanctuary');

const {Nil, Cons} = require ('./internal/List');
const eq = require ('./internal/eq');


test ('head', () => {

  eq (typeof S.head) ('function');
  eq (S.head.length) (1);
  eq (S.show (S.head)) ('head :: Foldable f => f a -> Maybe a');

  eq (S.head ([])) (S.Nothing);
  eq (S.head (['foo'])) (S.Just ('foo'));
  eq (S.head (['foo', 'bar'])) (S.Just ('foo'));
  eq (S.head (['foo', 'bar', 'baz'])) (S.Just ('foo'));

  eq (S.head (Nil)) (S.Nothing);
  eq (S.head (Cons ('foo') (Nil))) (S.Just ('foo'));
  eq (S.head (Cons ('foo') (Cons ('bar') (Nil)))) (S.Just ('foo'));
  eq (S.head (Cons ('foo') (Cons ('bar') (Cons ('baz') (Nil))))) (S.Just ('foo'));

});
