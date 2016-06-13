'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('toLower', function() {

  eq(typeof S.toLower, 'function');
  eq(S.toLower.length, 1);
  eq(S.toLower.toString(), 'toLower :: String -> String');

  eq(S.toLower(''), '');
  eq(S.toLower('ABC def 123'), 'abc def 123');

});
