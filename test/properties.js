'use strict';

const jsc = require ('jsverify');

const equals = require ('./internal/equals');


const basic = jsc.sum ([jsc.integer, jsc.string, jsc.bool, jsc.falsy]);

const useful = jsc.sum ([basic, jsc.array (basic), jsc.dict (basic), jsc.fn (basic)]);

exports.idempotent = f =>
  jsc.checkForall (useful, x => equals (f (f (x))) (f (x)));

exports.involution = f =>
  jsc.checkForall (useful, x => equals (f (f (x))) (x));
