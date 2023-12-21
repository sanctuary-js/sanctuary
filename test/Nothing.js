import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('Nothing', () => {

  eq (S.show (S.Nothing), 'Nothing');

  eq (S.Nothing, S.Nothing);

});
