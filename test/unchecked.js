import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('unchecked', () => {

  eq (S.unchecked.add (2) (2), 4);
  eq (S.unchecked.add (2) ('2'), '22');
  eq (S.unchecked.add ('2') (2), '22');
  eq (S.unchecked.add ('2') ('2'), '22');

});
