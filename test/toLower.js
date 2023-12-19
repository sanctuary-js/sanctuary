'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('toLower', () => {

  eq (String (S.toLower)) ('toLower :: String -> String');

  eq (S.toLower ('')) ('');
  eq (S.toLower ('ABC def 123')) ('abc def 123');

});
