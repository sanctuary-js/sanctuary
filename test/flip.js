import {deepStrictEqual as eq} from 'assert';

import S from './internal/sanctuary.js';

import {Nil, Cons} from './internal/List.mjs';


test ('flip', () => {

  eq (String (S.flip), 'flip :: Functor f => f (a -> b) -> a -> f b');

  eq (S.flip (S.concat) ('foo') ('bar'), 'barfoo');
  eq (S.map (S.flip (S.concat) ('!')) (['BAM', 'POW', 'KA-POW']), ['BAM!', 'POW!', 'KA-POW!']);
  eq (S.flip ([Math.floor, Math.ceil]) (1.5), [1, 2]);
  eq (S.flip ({floor: Math.floor, ceil: Math.ceil}) (1.5), {floor: 1, ceil: 2});
  eq (S.flip (Cons (Math.floor) (Cons (Math.ceil) (Nil))) (1.5), Cons (1) (Cons (2) (Nil)));

});
