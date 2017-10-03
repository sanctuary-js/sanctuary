import * as S from '..';

import eq from './internal/eq';


test('props', () => {

  eq(typeof S.props, 'function');
  eq(S.props.length, 2);
  eq(S.props.toString(), 'props :: Array String -> a -> b');

  eq(S.props(['a', 'b', 'c'])({a: {b: {c: 1}}}), 1);
  eq(S.props(['a', 'b', 'c', '0'])({a: {b: {c: [2, 4, 6]}}}), 2);
  eq(S.props(['a', 'b', 'c'])(Object.create({a: {b: {c: 1}}})), 1);

});
