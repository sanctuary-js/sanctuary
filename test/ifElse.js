import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('ifElse', () => {

  eq (String (S.ifElse), 'ifElse :: (a -> Boolean) -> (a -> b) -> (a -> b) -> a -> b');

  eq (S.ifElse (S.odd) (S.sub (1)) (S.add (1)) (9), 8);
  eq (S.ifElse (S.odd) (S.sub (1)) (S.add (1)) (0), 1);

});
