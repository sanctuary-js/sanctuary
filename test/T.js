'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('T', () => {

  eq (String (S.T), 'T :: a -> (a -> b) -> b');

  eq (S.T ('!') (S.concat ('foo')), 'foo!');
  eq (S.T ('!') (S.concat ('bar')), 'bar!');

});
