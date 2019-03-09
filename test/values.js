'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('values', () => {

  eq (typeof S.values) ('function');
  eq (S.values.length) (1);
  eq (S.show (S.values)) ('values :: StrMap a -> Array a');

  eq (S.sort (S.values ({}))) ([]);
  eq (S.sort (S.values ({a: 1, b: 2, c: 3}))) ([1, 2, 3]);

  const proto = {a: 1, b: 2};
  const obj = Object.create (proto);
  obj.c = 3;
  obj.d = 4;

  eq (S.sort (S.values (obj))) ([3, 4]);

});
