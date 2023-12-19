'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('singleton', () => {

  eq (String (S.singleton)) ('singleton :: String -> a -> StrMap a');

  eq (S.singleton ('foo') (42)) ({foo: 42});

});
