import * as S from '..';

import eq from './internal/eq';


test('words', () => {

  eq(typeof S.words, 'function');
  eq(S.words.length, 1);
  eq(S.words.toString(), 'words :: String -> Array String');

  eq(S.words(''), []);
  eq(S.words(' '), []);
  eq(S.words(' \t\r\n'), []);
  eq(S.words('foo bar baz'), ['foo', 'bar', 'baz']);
  eq(S.words(' foo bar baz '), ['foo', 'bar', 'baz']);
  eq(S.words('\tfoo\r\n\tbar\r\n\tbaz\r\n'), ['foo', 'bar', 'baz']);

});
