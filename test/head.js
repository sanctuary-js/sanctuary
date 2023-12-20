'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('./internal/sanctuary');

const {Nil, Cons} = require ('./internal/List');


test ('head', () => {

  eq (String (S.head), 'head :: Foldable f => f a -> Maybe a');

  eq (S.head ([]), S.Nothing);
  eq (S.head (['foo']), S.Just ('foo'));
  eq (S.head (['foo', 'bar']), S.Just ('foo'));
  eq (S.head (['foo', 'bar', 'baz']), S.Just ('foo'));

  eq (S.head (Nil), S.Nothing);
  eq (S.head (Cons ('foo') (Nil)), S.Just ('foo'));
  eq (S.head (Cons ('foo') (Cons ('bar') (Nil))), S.Just ('foo'));
  eq (S.head (Cons ('foo') (Cons ('bar') (Cons ('baz') (Nil)))), S.Just ('foo'));

});
