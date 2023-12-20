'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('toLower', () => {

  eq (String (S.toLower), 'toLower :: String -> String');

  eq (S.toLower (''), '');
  eq (S.toLower ('ABC def 123'), 'abc def 123');

});
