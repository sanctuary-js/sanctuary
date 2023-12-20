import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('fromLeft', () => {

  eq (String (S.fromLeft), 'fromLeft :: a -> Either a b -> a');

  eq (S.fromLeft ('abc') (S.Left ('xyz')), 'xyz');
  eq (S.fromLeft ('abc') (S.Right (123)), 'abc');

});
