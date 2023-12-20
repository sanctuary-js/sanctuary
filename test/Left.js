'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('Left', () => {

  eq (String (S.Left), 'Left :: a -> Either a b');

  eq (S.Left (42), S.Left (42));

});
