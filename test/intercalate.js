'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('intercalate', function() {

  eq (typeof S.intercalate) ('function');
  eq (S.intercalate.length) (1);
  eq (S.show (S.intercalate)) ('intercalate :: Monoid a => TypeRep a -> a -> Array a -> a');

  eq (S.intercalate (String) (', ') ([])) ('');
  eq (S.intercalate (String) (', ') (['foo'])) ('foo');
  eq (S.intercalate (String) (', ') (['foo', 'bar'])) ('foo, bar');
  eq (S.intercalate (String) (', ') (['foo', 'bar', 'baz'])) ('foo, bar, baz');

  eq (S.intercalate (Array) ([0]) ([])) ([]);
  eq (S.intercalate (Array) ([0]) ([[1]])) ([1]);
  eq (S.intercalate (Array) ([0]) ([[1], [2]])) ([1, 0, 2]);
  eq (S.intercalate (Array) ([0]) ([[1], [2], [3]])) ([1, 0, 2, 0, 3]);

});
