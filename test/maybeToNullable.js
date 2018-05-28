'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('maybeToNullable', function() {

  eq (typeof S.maybeToNullable) ('function');
  eq (S.maybeToNullable.length) (1);
  eq (S.show (S.maybeToNullable)) ('maybeToNullable :: Maybe a -> Nullable a');

  eq (S.maybeToNullable (S.Nothing)) (null);
  eq (S.maybeToNullable (S.Just (42))) (42);

});
