'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('reverse', function() {

  eq(typeof S.reverse, 'function');
  eq(S.reverse.length, 1);

  throws(function() { S.reverse({answer: 42}); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'reverse :: List a -> List a\n' +
         '           ^^^^^^\n' +
         '             1\n' +
         '\n' +
         '1)  {"answer": 42} :: Object, StrMap Number, StrMap FiniteNumber, StrMap NonZeroFiniteNumber, StrMap Integer, StrMap ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘List a’.\n');

  eq(S.reverse([]), []);
  eq(S.reverse([1, 2, 3]), [3, 2, 1]);
  eq(S.reverse(['1', '2', '3']), ['3', '2', '1']);

  eq(S.reverse(''), '');
  eq(S.reverse('123'), '321');

});
