import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import Nothing from 'sanctuary/Nothing';


test ('Nothing', () => {

  eq (S.Nothing === Nothing, true);
  eq (S.show (S.Nothing), 'Nothing');

  eq (S.Nothing, S.Nothing);

});
