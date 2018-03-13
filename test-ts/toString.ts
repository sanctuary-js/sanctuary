import * as S from '..';

import eq from './internal/eq';


test('toString', () => {

  eq(typeof S.toString, 'function');
  eq(S.toString.length, 1);
  eq(S.toString.toString(), 'toString :: Any -> String');

  eq(S.toString(null), 'null');
  eq(S.toString(undefined), 'undefined');
  eq(S.toString(false), 'false');
  eq(S.toString(true), 'true');
  eq(S.toString(new Boolean(false)), 'new Boolean(false)');
  eq(S.toString(new Boolean(true)), 'new Boolean(true)');
  eq(S.toString(0), '0');
  eq(S.toString(-0), '-0');
  eq(S.toString(NaN), 'NaN');
  eq(S.toString(Math.PI), '3.141592653589793');
  eq(S.toString(-Math.PI), '-3.141592653589793');
  eq(S.toString(Infinity), 'Infinity');
  eq(S.toString(-Infinity), '-Infinity');
  eq(S.toString(new Number(0)), 'new Number(0)');
  eq(S.toString(new Number(-0)), 'new Number(-0)');
  eq(S.toString(new Number(NaN)), 'new Number(NaN)');
  eq(S.toString(new Number(Math.PI)), 'new Number(3.141592653589793)');
  eq(S.toString(new Number(-Math.PI)), 'new Number(-3.141592653589793)');
  eq(S.toString(new Number(Infinity)), 'new Number(Infinity)');
  eq(S.toString(new Number(-Infinity)), 'new Number(-Infinity)');
  eq(S.toString(''), '""');
  eq(S.toString('foo'), '"foo"');
  eq(S.toString('foo "bar" baz'), '"foo \\"bar\\" baz"');
  eq(S.toString(new String('')), 'new String("")');
  eq(S.toString(new String('foo')), 'new String("foo")');
  eq(S.toString(new String('foo "bar" baz')), 'new String("foo \\"bar\\" baz")');
  eq(S.toString(new Date(0)), 'new Date("1970-01-01T00:00:00.000Z")');
  eq(S.toString(new Date(42)), 'new Date("1970-01-01T00:00:00.042Z")');
  eq(S.toString(new Date(NaN)), 'new Date(NaN)');
  eq(S.toString(new Date('2001-02-03T04:05:06')), 'new Date("2001-02-03T04:05:06.000Z")');
  eq(S.toString([]), '[]');
  eq(S.toString(['foo']), '["foo"]');
  eq(S.toString(['foo', 'bar', 'baz']), '["foo", "bar", "baz"]');
  eq(S.toString(['foo "bar" baz']), '["foo \\"bar\\" baz"]');
  eq(S.toString({}), '{}');
  eq(S.toString({x: 1}), '{"x": 1}');
  eq(S.toString({x: 1, y: 2, z: 3}), '{"x": 1, "y": 2, "z": 3}');
  eq(S.toString({'foo "bar" baz': '"quux"'}), '{"foo \\"bar\\" baz": "\\"quux\\""}');
  eq(S.toString(S.Nothing), 'Nothing');
  eq(S.toString(S.Just(9)), 'Just(9)');
  eq(S.toString(S.Left(false)), 'Left(false)');
  eq(S.toString(S.Right(true)), 'Right(true)');

});
