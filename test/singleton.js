'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('singleton', function() {

  eq(S.singleton('foo', 42), {foo: 42});

});
