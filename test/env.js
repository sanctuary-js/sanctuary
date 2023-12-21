import {deepStrictEqual as eq} from 'node:assert';

import $ from 'sanctuary-def';

import S from '../index.js';


test ('env', () => {

  eq (S.is ($.Array ($.Type)) (S.env), true);

});
