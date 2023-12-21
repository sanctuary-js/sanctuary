import {deepStrictEqual as eq} from 'node:assert';

import Identity from 'sanctuary-identity';

import S from './internal/sanctuary.js';


test ('extend', () => {

  eq (String (S.extend), 'extend :: Extend w => (w a -> b) -> w a -> w b');

  eq (S.extend (S.joinWith ('')) ([]), []);
  eq (S.extend (S.joinWith ('')) (['x']), ['x']);
  eq (S.extend (S.joinWith ('')) (['x', 'y']), ['xy', 'y']);
  eq (S.extend (S.joinWith ('')) (['x', 'y', 'z']), ['xyz', 'yz', 'z']);
  eq (S.extend (S.reduce (S.add) (1)) (Identity (42)), Identity (43));
  eq (S.extend (S.T ([3, 4])) (S.reverse) ([1, 2]), [4, 3, 2, 1]);

});
