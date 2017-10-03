const Z = require('sanctuary-type-classes');

import * as S from '..';

import eq from './internal/eq';


test('chainRec', () => {

  eq(typeof S.chainRec, 'function');
  eq(S.chainRec.length, 3);
  eq(S.chainRec.toString(), 'chainRec :: ChainRec m => TypeRep m -> (a -> m (Either a b)) -> a -> m b');

  function permute(s: string) {
    return s.length === 2 ? Z.map(S.Right, [s + '!', s + '?'])
                          : Z.map(S.Left, [s + 'o', s + 'n']);
  }
  eq(S.chainRec(Array)(permute)(''), ['oo!', 'oo?', 'on!', 'on?', 'no!', 'no?', 'nn!', 'nn?']);

  //  The following test case is concerned with stack usage rather than with
  //  the correctness of the result. This test case is a slightly modified
  //  version of one from sanctuary-type-classes. The "stop" value is lower
  //  to prevent the execution time from exceeding the test runner's timeout.
  function stepper(n: number) {
    return n === 3000 ? Z.map(S.Right, function(env: {step: number, inc: number}) { return n + env.inc; })
                      : Z.map(S.Left, function(env: {step: number, inc: number}) { return n + env.step; });
  }
  eq(S.chainRec(Function)(stepper)(0)({step: 2, inc: 100}), 3100);

});
