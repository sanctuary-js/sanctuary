'use strict';

const S = require ('./internal/sanctuary');

const {Nil, Cons} = require ('./internal/List');
const eq = require ('./internal/eq');


test ('joinWith', () => {

  eq (typeof S.joinWith) ('function');
  eq (S.joinWith.length) (1);
  eq (S.show (S.joinWith)) ('joinWith :: Foldable f => String -> f String -> String');

  eq (S.joinWith ('') (['a', 'b', 'c'])) ('abc');
  eq (S.joinWith (':') ([])) ('');
  eq (S.joinWith (':') ([''])) ('');
  eq (S.joinWith (':') (['', ''])) (':');
  eq (S.joinWith (':') (['', 'foo', ''])) (':foo:');
  eq (S.joinWith (':') (['foo', 'bar', 'baz'])) ('foo:bar:baz');
  eq (S.joinWith ('::') (['foo', 'bar', 'baz'])) ('foo::bar::baz');

  eq (S.joinWith ('') (Cons ('a') (Cons ('b') (Cons ('c') (Nil))))) ('abc');
  eq (S.joinWith (':') (Nil)) ('');
  eq (S.joinWith (':') (Cons ('') (Nil))) ('');
  eq (S.joinWith (':') (Cons ('') (Cons ('') (Nil)))) (':');
  eq (S.joinWith (':') (Cons ('') (Cons ('foo') (Cons ('') (Nil))))) (':foo:');
  eq (S.joinWith (':') (Cons ('foo') (Cons ('bar') (Cons ('baz') (Nil))))) ('foo:bar:baz');
  eq (S.joinWith ('::') (Cons ('foo') (Cons ('bar') (Cons ('baz') (Nil))))) ('foo::bar::baz');

});
