import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from './internal/sanctuary.js';

import {Nil, Cons} from './internal/List.mjs';


test ('rights', () => {

  eq (String (S.rights), 'rights :: (Filterable f, Functor f) => f (Either a b) -> f b');

  eq (S.rights ([]), []);
  eq (S.rights ([S.Left ('a'), S.Left ('b')]), []);
  eq (S.rights ([S.Left ('a'), S.Right (1)]), [1]);
  eq (S.rights ([S.Right (2), S.Left ('b')]), [2]);
  eq (S.rights ([S.Right (2), S.Right (1)]), [2, 1]);

  eq (S.rights ({}), {});
  eq (S.rights ({x: S.Left ('a'), y: S.Left ('b')}), {});
  eq (S.rights ({x: S.Left ('a'), y: S.Right (1)}), {y: 1});
  eq (S.rights ({x: S.Right (2), y: S.Left ('b')}), {x: 2});
  eq (S.rights ({x: S.Right (2), y: S.Right (1)}), {x: 2, y: 1});

  eq (S.rights (S.Nothing), S.Nothing);
  eq (S.rights (S.Just (S.Left ('a'))), S.Nothing);
  eq (S.rights (S.Just (S.Right (1))), S.Just (1));

  eq (S.rights (Nil), Nil);
  eq (S.rights (Cons (S.Left ('a')) (Cons (S.Left ('b')) (Nil))), Nil);
  eq (S.rights (Cons (S.Left ('a')) (Cons (S.Right (1)) (Nil))), Cons (1) (Nil));
  eq (S.rights (Cons (S.Right (2)) (Cons (S.Left ('b')) (Nil))), Cons (2) (Nil));
  eq (S.rights (Cons (S.Right (2)) (Cons (S.Right (1)) (Nil))), Cons (2) (Cons (1) (Nil)));

});
