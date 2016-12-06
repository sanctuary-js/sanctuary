'use strict';

var vm = require('vm');

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('is', function() {

  eq(typeof S.is, 'function');
  eq(S.is.length, 2);

  throws(function() { S.is([1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'is :: TypeRep -> Any -> Boolean\n' +
         '      ^^^^^^^\n' +
         '         1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘TypeRep’.\n');

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

  eq(S.is(S.Maybe,  S.Nothing),           true);
  eq(S.is(S.Maybe,  S.Just(9)),           true);
  eq(S.is(S.Maybe,  S.Left(9)),           false);
  eq(S.is(S.Maybe,  S.Right(9)),          false);

  eq(S.is(S.Either, S.Nothing),           false);
  eq(S.is(S.Either, S.Just(9)),           false);
  eq(S.is(S.Either, S.Left(9)),           true);
  eq(S.is(S.Either, S.Right(9)),          true);

  function FooBar() {}
  FooBar.prototype['@@type'] = 'foobar/FooBar';
  function Foo() {}
  Foo.prototype = new FooBar();
  function Bar() {}
  Bar.prototype = new FooBar();

  eq(S.is(FooBar, new Foo()), true);
  eq(S.is(FooBar, new Bar()), true);

  eq(S.is(Array, vm.runInNewContext('[1, 2, 3]')), true);
  eq(S.is(vm.runInNewContext('Array'), [1, 2, 3]), true);

});
