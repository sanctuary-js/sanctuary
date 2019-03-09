'use strict';

const S = require ('..');

const eq = require ('./internal/eq');
const throws = require ('./internal/throws');


test ('prop', () => {

  eq (typeof S.prop) ('function');
  eq (S.prop.length) (1);
  eq (S.show (S.prop)) ('prop :: String -> a -> b');

  throws (() => { S.prop ('xxx') ([1, 2, 3]); })
         (new TypeError ('‘prop’ expected object to have a property named ‘xxx’; [1, 2, 3] does not'));

  eq (S.prop ('a') ({a: 0, b: 1})) (0);
  eq (S.prop ('0') ([1, 2, 3])) (1);
  eq (S.prop ('length') ('abc')) (3);
  eq (S.prop ('x') (Object.create ({x: 1, y: 2}))) (1);
  eq (S.prop ('global') (/x/g)) (true);

  throws (() => { S.prop ('valueOf') (null); })
         (new TypeError ('‘prop’ expected object to have a property named ‘valueOf’; null does not'));

  throws (() => { S.prop ('valueOf') (undefined); })
         (new TypeError ('‘prop’ expected object to have a property named ‘valueOf’; undefined does not'));

});
