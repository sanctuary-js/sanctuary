'use strict';

var S = require('..');

var eq = require('./internal/eq');
var properties = require('./properties');


test('I', function() {

  eq(typeof S.I, 'function');
  eq(S.I.length, 1);

  eq(S.I([1, 2, 3]), [1, 2, 3]);
  eq(S.I(['foo', 42]), ['foo', 42]);
  eq(S.I({'@@type': 'my-package/Foreign'}), {'@@type': 'my-package/Foreign'});

  eq(properties.idempotent(S.I), true);
  eq(properties.involution(S.I), true);

});
