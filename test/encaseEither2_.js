'use strict';

var S = require('..');

var eq = require('./internal/eq');
var rem_ = require('./internal/rem_');


test('encaseEither2_', function() {

  eq(typeof S.encaseEither2_, 'function');
  eq(S.encaseEither2_.length, 4);

  eq(S.encaseEither2_(S.I, rem_, 42, 5), S.Right(2));
  eq(S.encaseEither2_(S.I, rem_, 42, 0), S.Left(new Error('Cannot divide by zero')));
  eq(S.encaseEither2_(S.prop('message'), rem_, 42, 0), S.Left('Cannot divide by zero'));

});
