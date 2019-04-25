'use strict';

const S = require ('..');

const eq = require ('./internal/eq');
const map = require ('./internal/map');


test ('chainRec', () => {

  eq (typeof S.chainRec) ('function');
  eq (S.chainRec.length) (1);
  eq (S.show (S.chainRec)) ('chainRec :: ChainRec m => TypeRep (m b) -> (a -> m (Either a b)) -> a -> m b');

  eq (S.chainRec (Array)
                 (s => s.length === 2 ? map (S.Right) ([s + '!', s + '?'])
                                      : map (S.Left) ([s + 'o', s + 'n']))
                 (''))
     (['oo!', 'oo?', 'on!', 'on?', 'no!', 'no?', 'nn!', 'nn?']);

  //  The following test case is concerned with stack usage rather than with
  //  the correctness of the result. This test case is a slightly modified
  //  version of one from sanctuary-type-classes. The "stop" value is lower
  //  to prevent the execution time from exceeding the test runner's timeout.
  eq (S.chainRec (Function)
                 (n => n === 3000 ? map (S.Right) (env => n + env.inc)
                                  : map (S.Left) (env => n + env.step))
                 (0)
                 ({step: 2, inc: 100}))
     (3100);

});
