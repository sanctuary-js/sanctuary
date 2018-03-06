'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('at', function() {

  eq (typeof S.at) ('function');
  eq (S.at.length) (1);
  eq (String (S.at)) ('at :: Integer -> Array a -> Maybe a');

  eq (S.at (-4) (['foo', 'bar', 'baz'])) (S.Nothing);
  eq (S.at (-3) (['foo', 'bar', 'baz'])) (S.Just ('foo'));
  eq (S.at (-2) (['foo', 'bar', 'baz'])) (S.Just ('bar'));
  eq (S.at (-1) (['foo', 'bar', 'baz'])) (S.Just ('baz'));

  eq (S.at (0) (['foo', 'bar', 'baz'])) (S.Just ('foo'));
  eq (S.at (1) (['foo', 'bar', 'baz'])) (S.Just ('bar'));
  eq (S.at (2) (['foo', 'bar', 'baz'])) (S.Just ('baz'));
  eq (S.at (3) (['foo', 'bar', 'baz'])) (S.Nothing);

});
