'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('Right', () => {

  eq (String (S.Right), 'Right :: b -> Either a b');

  eq (S.Right (42), S.Right (42));

});
