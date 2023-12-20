'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('parseDate', () => {

  eq (String (S.parseDate), 'parseDate :: String -> Maybe ValidDate');

  eq (S.parseDate ('2001-02-03T04:05:06Z'), S.Just (new Date ('2001-02-03T04:05:06Z')));
  eq (S.parseDate ('today'), S.Nothing);

});
