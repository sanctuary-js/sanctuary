'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('array', function() {

  eq (typeof S.array) ('function');
  eq (S.array.length) (1);
  eq (S.show (S.array)) ('array :: b -> (a -> Array a -> b) -> Array a -> b');

  var size = S.array (0) (function(head) {
    return function(tail) {
      return 1 + size (tail);
    };
  });
  eq (size ([])) (0);
  eq (size (['foo'])) (1);
  eq (size (['foo', 'bar'])) (2);
  eq (size (['foo', 'bar', 'baz'])) (3);

  var reverse = S.array ([]) (function(head) {
    return function(tail) {
      return S.append (head) (reverse (tail));
    };
  });
  eq (reverse ([])) ([]);
  eq (reverse (['foo'])) (['foo']);
  eq (reverse (['foo', 'bar'])) (['bar', 'foo']);
  eq (reverse (['foo', 'bar', 'baz'])) (['baz', 'bar', 'foo']);

  var tail = S.array (S.Nothing) (S.K (S.Just));
  eq (tail ([])) (S.Nothing);
  eq (tail (['foo'])) (S.Just ([]));
  eq (tail (['foo', 'bar'])) (S.Just (['bar']));
  eq (tail (['foo', 'bar', 'baz'])) (S.Just (['bar', 'baz']));

});
