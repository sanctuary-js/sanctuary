'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('./internal/sanctuary');

const {Nil, Cons} = require ('./internal/List');


test ('last', () => {

  eq (String (S.last), 'last :: Foldable f => f a -> Maybe a');

  eq (S.last ([]), S.Nothing);
  eq (S.last (['foo']), S.Just ('foo'));
  eq (S.last (['foo', 'bar']), S.Just ('bar'));
  eq (S.last (['foo', 'bar', 'baz']), S.Just ('baz'));

  eq (S.last (Nil), S.Nothing);
  eq (S.last (Cons ('foo') (Nil)), S.Just ('foo'));
  eq (S.last (Cons ('foo') (Cons ('bar') (Nil))), S.Just ('bar'));
  eq (S.last (Cons ('foo') (Cons ('bar') (Cons ('baz') (Nil)))), S.Just ('baz'));

});
