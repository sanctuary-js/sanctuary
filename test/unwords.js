import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import unwords from 'sanctuary/unwords';


test ('unwords', () => {

  eq (S.unwords === unwords, true);
  eq (String (S.unwords), 'unwords :: Array String -> String');

  eq (S.unwords ([]), '');
  eq (S.unwords (['']), '');
  eq (S.unwords (['', '']), ' ');
  eq (S.unwords ([' ']), ' ');
  eq (S.unwords ([' ', ' ']), '   ');
  eq (S.unwords (['foo', 'bar', 'baz']), 'foo bar baz');
  eq (S.unwords ([' foo ', ' bar ', ' baz ']), ' foo   bar   baz ');

});
