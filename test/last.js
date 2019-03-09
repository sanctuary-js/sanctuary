'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('last', () => {

  eq (typeof S.last) ('function');
  eq (S.last.length) (1);
  eq (S.show (S.last)) ('last :: Array a -> Maybe a');

  eq (S.last ([])) (S.Nothing);
  eq (S.last (['foo'])) (S.Just ('foo'));
  eq (S.last (['foo', 'bar'])) (S.Just ('bar'));
  eq (S.last (['foo', 'bar', 'baz'])) (S.Just ('baz'));

});
