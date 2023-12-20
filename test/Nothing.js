'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('Nothing', () => {

  eq (S.show (S.Nothing), 'Nothing');

  eq (S.Nothing, S.Nothing);

});
