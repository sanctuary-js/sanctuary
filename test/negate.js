'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('negate', function() {

  eq(typeof S.negate, 'function');
  eq(S.negate.length, 1);

  throws(function() { S.negate(NaN); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'negate :: ValidNumber -> ValidNumber\n' +
                 '          ^^^^^^^^^^^\n' +
                 '               1\n' +
                 '\n' +
                 '1)  NaN :: Number\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘ValidNumber’.\n'));

  eq(S.negate(0.5), -0.5);
  eq(S.negate(-0.5), 0.5);
  eq(S.negate(0), -0);
  eq(S.negate(-0), 0);
  eq(S.negate(new Number(0.5)), -0.5);
  eq(S.negate(new Number(-0.5)), 0.5);
  eq(S.negate(new Number(0)), -0);
  eq(S.negate(new Number(-0)), 0);

});
