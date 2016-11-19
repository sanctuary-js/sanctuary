'use strict';

var S = require('..');

var area_ = require('./internal/area_');
var eq = require('./internal/eq');


test('encaseEither3_', function() {

  eq(typeof S.encaseEither3_, 'function');
  eq(S.encaseEither3_.length, 5);

  eq(S.encaseEither3_(S.I, area_, 3, 4, 5), S.Right(6));
  eq(S.encaseEither3_(S.I, area_, 2, 2, 5), S.Left(new Error('Impossible triangle')));
  eq(S.encaseEither3_(S.prop('message'), area_, 2, 2, 5), S.Left('Impossible triangle'));

});
