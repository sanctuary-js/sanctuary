'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('parseDate', () => {

  eq (typeof S.parseDate) ('function');
  eq (S.parseDate.length) (1);
  eq (S.show (S.parseDate)) ('parseDate :: String -> Maybe ValidDate');

  eq (S.parseDate ('2001-02-03T04:05:06Z')) (S.Just (new Date ('2001-02-03T04:05:06Z')));
  eq (S.parseDate ('today')) (S.Nothing);

});
