'use strict';

var throws = require('assert').throws;
var vm = require('vm');

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('is', function() {

  it('is a binary function', function() {
    eq(typeof S.is, 'function');
    eq(S.is.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.is([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'is :: TypeRep -> Any -> Boolean\n' +
                   '      ^^^^^^^\n' +
                   '         1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘TypeRep’.\n'));
  });

  it('works for built-in type', function() {
    eq(S.is(Array,    []),                  true);
    eq(S.is(Boolean,  false),               true);
    eq(S.is(Date,     new Date(0)),         true);
    eq(S.is(Function, function() {}),       true);
    eq(S.is(Number,   0),                   true);
    eq(S.is(Object,   {}),                  true);
    eq(S.is(RegExp,   /(?:)/),              true);
    eq(S.is(String,   ''),                  true);
    eq(S.is(Boolean,  new Boolean(false)),  true);
    eq(S.is(Number,   new Number(0)),       true);
    eq(S.is(String,   new String('')),      true);
    eq(S.is(Array,    null),                false);
    eq(S.is(Array,    undefined),           false);
    eq(S.is(Array,    {}),                  false);
  });

  it('works for user-defined type', function() {
    var FooBar = function FooBar() {};
    FooBar.prototype['@@type'] = 'foobar/FooBar';
    var Foo = function Foo() {};
    Foo.prototype = new FooBar();
    var Bar = function Bar() {};
    Bar.prototype = new FooBar();

    eq(S.is(FooBar, new Foo()), true);
    eq(S.is(FooBar, new Bar()), true);
  });

  it('does not rely on varructor identity', function() {
    eq(S.is(Array, vm.runInNewContext('[1, 2, 3]')), true);
    eq(S.is(vm.runInNewContext('Array'), [1, 2, 3]), true);
  });

});
