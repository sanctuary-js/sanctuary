
import $ from 'sanctuary-def'
import { defaultEnv } from './_internal'

var createSanctuary = () => {}

//# create :: { checkTypes :: Boolean, env :: Array Type } -> Module
//.
//. Takes an options record and returns a Sanctuary module. `checkTypes`
//. specifies whether to enable type checking. The module's polymorphic
//. functions (such as [`I`](#I)) require each value associated with a
//. type variable to be a member of at least one type in the environment.
//.
//. A well-typed application of a Sanctuary function will produce the same
//. result regardless of whether type checking is enabled. If type checking
//. is enabled, a badly typed application will produce an exception with a
//. descriptive error message.
//.
//. The following snippet demonstrates defining a custom type and using
//. `create` to produce a Sanctuary module which is aware of that type:
//.
//. ```javascript
//. const {create, env} = require('sanctuary');
//. const $ = require('sanctuary-def');
//.
//. //    identityTypeName :: String
//. const identityTypeName = 'my-package/Identity';
//.
//. //    Identity :: a -> Identity a
//. const Identity = function Identity(x) {
//.   return {
//.     '@@type': identityTypeName,
//.     map: f => Identity(f(x)),
//.     chain: f => f(x),
//.     // ...
//.     value: x,
//.   };
//. };
//.
//. //    isIdentity :: a -> Boolean
//. const isIdentity = x => x != null && x['@@type'] === identityTypeName;
//.
//. //    identityToArray :: Identity a -> Array a
//. const identityToArray = identity => [identity.value];
//.
//. //    IdentityType :: Type
//. const IdentityType =
//. $.UnaryType(identityTypeName, isIdentity, identityToArray);
//.
//. const S = create({
//.   checkTypes: process.env.NODE_ENV !== 'production',
//.   env: env.concat([IdentityType]),
//. });
//. ```
//.
//. See also [`env`](#env).
export const create = $.create({
  checkTypes: opts.checkTypes,
  env: defaultEnv
})('create', {}, [Options, $.Object], createSanctuary);
