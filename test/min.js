import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('min', () => {

  eq (String (S.min), 'min :: Ord a => a -> a -> a');

  eq (S.min (10) (2), 2);
  eq (S.min (2) (10), 2);
  eq (S.min (0.1) (0.01), 0.01);
  eq (S.min (0.01) (0.1), 0.01);
  eq (S.min (Infinity) (-Infinity), -Infinity);
  eq (S.min (-Infinity) (Infinity), -Infinity);

  eq (S.min (new Date (10)) (new Date (2)), new Date (2));
  eq (S.min (new Date (2)) (new Date (10)), new Date (2));

  eq (S.min ('abc') ('xyz'), 'abc');
  eq (S.min ('xyz') ('abc'), 'abc');
  eq (S.min ('10') ('2'), '10');
  eq (S.min ('2') ('10'), '10');
  eq (S.min ('A') ('a'), 'A');
  eq (S.min ('a') ('A'), 'A');

});
