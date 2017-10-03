const $ = require('sanctuary-def');

import * as S from '..';

import eq from './internal/eq';


test('env', () => {

  eq(typeof S.env, 'object');
  eq($.test([], $.Array($.Type), S.env), true);

});
