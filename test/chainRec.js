'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('chainRec', () => {

  eq (String (S.chainRec), 'chainRec :: ChainRec m => TypeRep (m b) -> (a -> m (Either a b)) -> a -> m b');

  eq (S.chainRec (Array)
                 (s => s.length === 2 ? S.map (S.Right) ([s + '!', s + '?'])
                                      : S.map (S.Left) ([s + 'o', s + 'n']))
                 (''),
      ['oo!', 'oo?', 'on!', 'on?', 'no!', 'no?', 'nn!', 'nn?']);

  //  The following test case is concerned with stack usage rather than with
  //  the correctness of the result. This test case is a slightly modified
  //  version of one from sanctuary-type-classes. The "stop" value is lower
  //  to prevent the execution time from exceeding the test runner's timeout.
  eq (S.chainRec (Function)
                 (n => n === 3000 ? S.map (S.Right) (env => n + env.inc)
                                  : S.map (S.Left) (env => n + env.step))
                 (0)
                 ({step: 2, inc: 100}),
      3100);

});
