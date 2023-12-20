'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('Just', () => {

  eq (String (S.Just), 'Just :: a -> Maybe a');

  eq (S.Just (42), S.Just (42));

});
