'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('show', () => {

  eq (String (S.show)) ('show :: Any -> String');

  eq (S.show (null)) ('null');
  eq (S.show (undefined)) ('undefined');
  eq (S.show (false)) ('false');
  eq (S.show (true)) ('true');
  eq (S.show (new Boolean (false))) ('new Boolean (false)');
  eq (S.show (new Boolean (true))) ('new Boolean (true)');
  eq (S.show (0)) ('0');
  eq (S.show (-0)) ('-0');
  eq (S.show (NaN)) ('NaN');
  eq (S.show (Math.PI)) ('3.141592653589793');
  eq (S.show (-Math.PI)) ('-3.141592653589793');
  eq (S.show (Infinity)) ('Infinity');
  eq (S.show (-Infinity)) ('-Infinity');
  eq (S.show (new Number (0))) ('new Number (0)');
  eq (S.show (new Number (-0))) ('new Number (-0)');
  eq (S.show (new Number (NaN))) ('new Number (NaN)');
  eq (S.show (new Number (Math.PI))) ('new Number (3.141592653589793)');
  eq (S.show (new Number (-Math.PI))) ('new Number (-3.141592653589793)');
  eq (S.show (new Number (Infinity))) ('new Number (Infinity)');
  eq (S.show (new Number (-Infinity))) ('new Number (-Infinity)');
  eq (S.show ('')) ('""');
  eq (S.show ('foo')) ('"foo"');
  eq (S.show ('foo "bar" baz')) ('"foo \\"bar\\" baz"');
  eq (S.show (new String (''))) ('new String ("")');
  eq (S.show (new String ('foo'))) ('new String ("foo")');
  eq (S.show (new String ('foo "bar" baz'))) ('new String ("foo \\"bar\\" baz")');
  eq (S.show (new Date (0))) ('new Date ("1970-01-01T00:00:00.000Z")');
  eq (S.show (new Date (42))) ('new Date ("1970-01-01T00:00:00.042Z")');
  eq (S.show (new Date (NaN))) ('new Date (NaN)');
  eq (S.show (new Date ('2001-02-03'))) ('new Date ("2001-02-03T00:00:00.000Z")');
  eq (S.show ([])) ('[]');
  eq (S.show (['foo'])) ('["foo"]');
  eq (S.show (['foo', 'bar', 'baz'])) ('["foo", "bar", "baz"]');
  eq (S.show (['foo "bar" baz'])) ('["foo \\"bar\\" baz"]');
  eq (S.show ({})) ('{}');
  eq (S.show ({x: 1})) ('{"x": 1}');
  eq (S.show ({x: 1, y: 2, z: 3})) ('{"x": 1, "y": 2, "z": 3}');
  eq (S.show ({'foo "bar" baz': '"quux"'})) ('{"foo \\"bar\\" baz": "\\"quux\\""}');
  eq (S.show (S.Nothing)) ('Nothing');
  eq (S.show (S.Just (9))) ('Just (9)');
  eq (S.show (S.Left (false))) ('Left (false)');
  eq (S.show (S.Right (true))) ('Right (true)');

});
