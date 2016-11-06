'use strict';

var throws = require('assert').throws;

var $ = require('sanctuary-def');

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


//  customEnv :: Array Type
var customEnv = S.env.concat([$.EnumType(['foo', true, 42])]);

var checkedDefaultEnv   = S.create({checkTypes: true, env: S.env});
var checkedCustomEnv    = S.create({checkTypes: true, env: customEnv});
var uncheckedDefaultEnv = S.create({checkTypes: false, env: S.env});
var uncheckedCustomEnv  = S.create({checkTypes: false, env: customEnv});


describe('create', function() {

  it('is a unary function', function() {
    eq(typeof S.create, 'function');
    eq(S.create.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.create({}); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'create :: { checkTypes :: Boolean, env :: Array Any } -> Object\n' +
                   '          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n' +
                   '                               1\n' +
                   '\n' +
                   '1)  {} :: Object, StrMap ???\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘{ checkTypes :: Boolean, env :: Array Any }’.\n'));

    throws(function() { S.create({checkTypes: 'true', env: []}); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'create :: { checkTypes :: Boolean, env :: Array Any } -> Object\n' +
                   '                          ^^^^^^^\n' +
                   '                             1\n' +
                   '\n' +
                   '1)  "true" :: String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Boolean’.\n'));
  });

  it('returns a Sanctuary module', function() {
    var expected = Object.keys(S).sort();
    eq(Object.keys(checkedDefaultEnv).sort(), expected);
    eq(Object.keys(checkedCustomEnv).sort(), expected);
    eq(Object.keys(uncheckedDefaultEnv).sort(), expected);
    eq(Object.keys(uncheckedCustomEnv).sort(), expected);
  });

  it('can create a module which does not perform type checking', function() {
    eq(uncheckedDefaultEnv.inc(42), S.inc(42));
    eq(uncheckedDefaultEnv.inc('XXX'), 'XXX1');
  });

  it('can create a module with a custom environment', function() {
    throws(function() { S.I(['foo', 'foo', 42]); },
           errorEq(TypeError,
                   'Type-variable constraint violation\n' +
                   '\n' +
                   'I :: a -> a\n' +
                   '     ^\n' +
                   '     1\n' +
                   '\n' +
                   '1)  ["foo", "foo", 42] :: Array ???\n' +
                   '\n' +
                   'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n'));

    eq(checkedCustomEnv.I(['foo', 'foo', 42]), ['foo', 'foo', 42]);
  });

});
