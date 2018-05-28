'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('singleton', function() {

  eq (typeof S.singleton) ('function');
  eq (S.singleton.length) (1);
  eq (S.show (S.singleton)) ('singleton :: String -> a -> StrMap a');

  eq (S.singleton ('foo') (42)) ({foo: 42});

});
