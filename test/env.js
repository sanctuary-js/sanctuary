'use strict';

const {deepStrictEqual: eq} = require ('assert');

const $ = require ('sanctuary-def');

const S = require ('..');


test ('env', () => {

  eq (S.is ($.Array ($.Type)) (S.env), true);

});
