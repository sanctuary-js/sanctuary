'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('boolean', () => {

  eq (String (S.boolean), 'boolean :: a -> a -> Boolean -> a');

  eq (S.boolean ('no') ('yes') (false), 'no');
  eq (S.boolean ('no') ('yes') (true), 'yes');

});
