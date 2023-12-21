import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('Left', () => {

  eq (String (S.Left), 'Left :: a -> Either a b');

  eq (S.Left (42), S.Left (42));

});
