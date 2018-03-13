const $ = require('sanctuary-def');

import * as S from '..';

import eq from './internal/eq';


//    FooTrue42 :: Type
const FooTrue42 = $.EnumType('my-package/FooTrue42', '', ['foo', true, 42]);

//    customEnv :: Array Type
const customEnv = S.env.concat([FooTrue42]);

const checkedDefaultEnv   = S.create({checkTypes: true, env: S.env});
const checkedCustomEnv    = S.create({checkTypes: true, env: customEnv});
const uncheckedDefaultEnv = S.create({checkTypes: false, env: S.env});
const uncheckedCustomEnv  = S.create({checkTypes: false, env: customEnv});


test('create', () => {

  eq(typeof S.create, 'function');
  eq(S.create.length, 1);
  eq(S.create.toString(), 'create :: { checkTypes :: Boolean, env :: Array Any } -> Object');

  const expected = Object.keys(S).sort();
  eq(Object.keys(checkedDefaultEnv).sort(), expected);
  eq(Object.keys(checkedCustomEnv).sort(), expected);
  eq(Object.keys(uncheckedDefaultEnv).sort(), expected);
  eq(Object.keys(uncheckedCustomEnv).sort(), expected);

//eq(uncheckedDefaultEnv.add(1)(42), S.add(1)(42));
//eq(uncheckedDefaultEnv.add(1)('XXX'), '1XXX');

//eq(checkedCustomEnv.I(['foo', 'foo', 42]), ['foo', 'foo', 42]);

});
