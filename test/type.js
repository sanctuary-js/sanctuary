'use strict';

var vm = require ('vm');

var S = require ('..');

var eq = require ('./internal/eq');


test ('type', function() {

  eq (typeof S.type) ('function');
  eq (S.type.length) (1);
  eq (S.show (S.type)) ('type :: Any -> { name :: String, namespace :: Maybe String, version :: NonNegativeInteger }');

  eq (S.type (function() { return arguments; } ()))
     ({namespace: S.Nothing, name: 'Arguments', version: 0});
  eq (S.type ([]))
     ({namespace: S.Nothing, name: 'Array', version: 0});
  eq (S.type (false))
     ({namespace: S.Nothing, name: 'Boolean', version: 0});
  eq (S.type (new Date (0)))
     ({namespace: S.Nothing, name: 'Date', version: 0});
  eq (S.type (new TypeError ()))
     ({namespace: S.Nothing, name: 'Error', version: 0});
  eq (S.type (function() {}))
     ({namespace: S.Nothing, name: 'Function', version: 0});
  eq (S.type (null))
     ({namespace: S.Nothing, name: 'Null', version: 0});
  eq (S.type (0))
     ({namespace: S.Nothing, name: 'Number', version: 0});
  eq (S.type (/(?:)/))
     ({namespace: S.Nothing, name: 'RegExp', version: 0});
  eq (S.type (''))
     ({namespace: S.Nothing, name: 'String', version: 0});
  eq (S.type (undefined))
     ({namespace: S.Nothing, name: 'Undefined', version: 0});
  eq (S.type (new Boolean (false)))
     ({namespace: S.Nothing, name: 'Boolean', version: 0});
  eq (S.type (new Number (0)))
     ({namespace: S.Nothing, name: 'Number', version: 0});
  eq (S.type (new String ('')))
     ({namespace: S.Nothing, name: 'String', version: 0});

  eq (S.type (S.Left (42)))
     ({namespace: S.Just ('sanctuary-either'), name: 'Either', version: 1});
  eq (S.type (S.Right (42)))
     ({namespace: S.Just ('sanctuary-either'), name: 'Either', version: 1});
  eq (S.type (S.Nothing))
     ({namespace: S.Just ('sanctuary-maybe'), name: 'Maybe', version: 1});
  eq (S.type (S.Just (42)))
     ({namespace: S.Just ('sanctuary-maybe'), name: 'Maybe', version: 1});

  function Gizmo() {}
  Gizmo['@@type'] = 'gadgets/Gizmo@42';

  eq (S.type (new Gizmo ()))
     ({namespace: S.Just ('gadgets'), name: 'Gizmo', version: 42});
  eq (S.type (Gizmo))
     ({namespace: S.Nothing, name: 'Function', version: 0});
  eq (S.type (Gizmo.prototype))
     ({namespace: S.Nothing, name: 'Object', version: 0});

  eq (S.type (vm.runInNewContext ('[1, 2, 3]')))
     ({namespace: S.Nothing, name: 'Array', version: 0});

});
