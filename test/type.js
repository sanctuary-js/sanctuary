'use strict';

var vm = require('vm');

var eq = require('./utils').eq;
var S = require('..');


describe('type', function() {

  it('is a unary function', function() {
    eq(typeof S.type, 'function');
    eq(S.type.length, 1);
  });

  it('operates on values of built-in types', function() {
    eq(S.type((function() { return arguments; }())),
       'Arguments');
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
  });

  it('operates on values of Sanctuary types', function() {
    eq(S.type(S.Left(42)),  'sanctuary/Either');
    eq(S.type(S.Right(42)), 'sanctuary/Either');
    eq(S.type(S.Nothing()), 'sanctuary/Maybe');
    eq(S.type(S.Just(42)),  'sanctuary/Maybe');
  });

  it('operates on values of user-defined types', function() {
    var Gizmo = function Gizmo() {};
    Gizmo.prototype['@@type'] = 'gadgets/Gizmo';

    eq(S.type(new Gizmo()), 'gadgets/Gizmo');
    eq(S.type({'@@type': 'foobar/FooBar'}), 'foobar/FooBar');
  });

  it('does not rely on constructor identity', function() {
    eq(S.type(vm.runInNewContext('[1, 2, 3]')), 'Array');
  });

});
