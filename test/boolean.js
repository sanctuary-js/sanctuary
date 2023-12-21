import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('boolean', () => {

  eq (String (S.boolean), 'boolean :: a -> a -> Boolean -> a');

  eq (S.boolean ('no') ('yes') (false), 'no');
  eq (S.boolean ('no') ('yes') (true), 'yes');

});
