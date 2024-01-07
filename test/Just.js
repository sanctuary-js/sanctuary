import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('Just', () => {

  eq (String (S.Just), 'Just :: a -> Maybe a');

  eq (S.Just (42), S.Just (42));

});
