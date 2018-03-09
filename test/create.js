'use strict';

var $ = require('sanctuary-def');

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


//  FooTrue42 :: Type
var FooTrue42 = $.EnumType('my-package/FooTrue42', '', ['foo', true, 42]);

//  customEnv :: Array Type
var customEnv = S.env.concat([FooTrue42]);

var checkedDefaultEnv   = S.create({checkTypes: true, env: S.env});
var checkedCustomEnv    = S.create({checkTypes: true, env: customEnv});
var uncheckedDefaultEnv = S.create({checkTypes: false, env: S.env});
var uncheckedCustomEnv  = S.create({checkTypes: false, env: customEnv});


test('create', function() {

  eq(typeof S.create, 'function');
  eq(S.create.length, 1);
  eq(S.create.toString(), 'create :: { checkTypes :: Boolean, env :: Array Any } -> Object');

  var expected = S.sort(Object.keys(S));
  eq(S.sort(Object.keys(checkedDefaultEnv)), expected);
  eq(S.sort(Object.keys(checkedCustomEnv)), expected);
  eq(S.sort(Object.keys(uncheckedDefaultEnv)), expected);
  eq(S.sort(Object.keys(uncheckedCustomEnv)), expected);

  eq(uncheckedDefaultEnv.add(1, 42), S.add(1, 42));
  eq(uncheckedDefaultEnv.add(1, 'XXX'), '1XXX');

  throws(function() { S.I(['foo', 'foo', 42]); },
         TypeError,
         'Type-variable constraint violation\n' +
         '\n' +
         'I :: a -> a\n' +
         '     ^\n' +
         '     1\n' +
         '\n' +
         '1)  ["foo", "foo", 42] :: Array ???\n' +
         '\n' +
         'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n');

  eq(checkedCustomEnv.I(['foo', 'foo', 42]), ['foo', 'foo', 42]);

});
