'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('ap', () => {

  eq (String (S.ap), 'ap :: Apply f => f (a -> b) -> f a -> f b');

  eq (S.ap ([]) ([]), []);
  eq (S.ap ([]) ([1, 2, 3]), []);
  eq (S.ap ([S.add (1)]) ([]), []);
  eq (S.ap ([S.add (1)]) ([1, 2, 3]), [2, 3, 4]);
  eq (S.ap ([S.sub (1), Math.sqrt]) ([1, 4, 9]), [0, 3, 8, 1, 2, 3]);
  eq (S.ap ({}) ({}), {});
  eq (S.ap ({}) ({x: 1, y: 2, z: 3}), {});
  eq (S.ap ({x: S.add (1)}) ({}), {});
  eq (S.ap ({x: S.add (1)}) ({x: 1}), {x: 2});
  eq (S.ap ({x: S.add (1), y: S.sub (1), z: Math.sqrt}) ({w: 0, x: 1, y: 2}), {x: 2, y: 1});
  eq (S.ap (S.Nothing) (S.Nothing), S.Nothing);
  eq (S.ap (S.Nothing) (S.Just (9)), S.Nothing);
  eq (S.ap (S.Just (Math.sqrt)) (S.Nothing), S.Nothing);
  eq (S.ap (S.Just (Math.sqrt)) (S.Just (9)), S.Just (3));

});
