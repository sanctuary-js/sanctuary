import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('unwords', () => {

  eq (String (S.unwords), 'unwords :: Array String -> String');

  eq (S.unwords ([]), '');
  eq (S.unwords (['']), '');
  eq (S.unwords (['', '']), ' ');
  eq (S.unwords ([' ']), ' ');
  eq (S.unwords ([' ', ' ']), '   ');
  eq (S.unwords (['foo', 'bar', 'baz']), 'foo bar baz');
  eq (S.unwords ([' foo ', ' bar ', ' baz ']), ' foo   bar   baz ');

});
