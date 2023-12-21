import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('lines', () => {

  eq (String (S.lines), 'lines :: String -> Array String');

  eq (S.lines (''), []);
  eq (S.lines ('\n'), ['']);
  eq (S.lines ('\n\n'), ['', '']);
  eq (S.lines ('foo\nbar\nbaz'), ['foo', 'bar', 'baz']);
  eq (S.lines ('foo\nbar\nbaz\n'), ['foo', 'bar', 'baz']);
  eq (S.lines ('\tfoo\r\n\tbar\r\n\tbaz\r\n'), ['\tfoo', '\tbar', '\tbaz']);

});
