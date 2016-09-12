'use strict';

var S = require('..');

var eq = require('./internal/eq');
var map = require('./internal/map');


test('chainRec', function() {

  eq(typeof S.chainRec, 'function');
  eq(S.chainRec.length, 3);
  eq(S.chainRec.toString(), 'chainRec :: ChainRec m => TypeRep m -> (a -> m (Either a b)) -> a -> m b');

  function permute(s) {
    return s.length === 2 ? map(S.Right)([s + '!', s + '?'])
                          : map(S.Left)([s + 'o', s + 'n']);
  }
  eq(S.chainRec(Array, permute, ''), ['oo!', 'oo?', 'on!', 'on?', 'no!', 'no?', 'nn!', 'nn?']);

  //  The following test case is concerned with stack usage rather than with
  //  the correctness of the result. This test case is a slightly modified
  //  version of one from sanctuary-type-classes. The "stop" value is lower
  //  to prevent the execution time from exceeding the test runner's timeout.
  function stepper(n) {
    return n === 3000 ? map(S.Right)(function(env) { return n + env.inc; })
                      : map(S.Left)(function(env) { return n + env.step; });
  }
  eq(S.chainRec(Function, stepper, 0)({step: 2, inc: 100}), 3100);

});
