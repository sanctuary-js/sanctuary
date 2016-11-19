'use strict';

var vm = require('vm');

var S = require('..');

var eq = require('./internal/eq');


test('type', function() {

  eq(typeof S.type, 'function');
  eq(S.type.length, 1);

  var args = (function() { return arguments; }());
  eq(S.type(args),                'Arguments');
  eq(S.type([]),                  'Array');
  eq(S.type(false),               'Boolean');
  eq(S.type(new Date(0)),         'Date');
  eq(S.type(new TypeError()),     'Error');
  eq(S.type(function() {}),       'Function');
  eq(S.type(null),                'Null');
  eq(S.type(0),                   'Number');
  eq(S.type(/(?:)/),              'RegExp');
  eq(S.type(''),                  'String');
  eq(S.type(undefined),           'Undefined');
  eq(S.type(new Boolean(false)),  'Boolean');
  eq(S.type(new Number(0)),       'Number');
  eq(S.type(new String('')),      'String');

  eq(S.type(S.Left(42)),  'sanctuary/Either');
  eq(S.type(S.Right(42)), 'sanctuary/Either');
  eq(S.type(S.Nothing),   'sanctuary/Maybe');
  eq(S.type(S.Just(42)),  'sanctuary/Maybe');

  var Gizmo = function Gizmo() {};
  Gizmo.prototype['@@type'] = 'gadgets/Gizmo';

  eq(S.type(new Gizmo()), 'gadgets/Gizmo');
  eq(S.type({'@@type': 'foobar/FooBar'}), 'foobar/FooBar');

  eq(S.type(vm.runInNewContext('[1, 2, 3]')), 'Array');

});
