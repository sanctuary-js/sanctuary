'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('singleton', () => {

  eq (String (S.singleton), 'singleton :: String -> a -> StrMap a');

  eq (S.singleton ('foo') (42), {foo: 42});

});
