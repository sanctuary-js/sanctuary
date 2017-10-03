//import * as S from './internal/sanctuary';
import * as S from '..';

//import Identity from './internal/Identity';
import eq from './internal/eq';


test('extend', () => {

  eq(typeof S.extend, 'function');
  eq(S.extend.length, 2);
  eq(S.extend.toString(), 'extend :: Extend w => (w a -> b) -> w a -> w b');

  eq(S.extend(S.joinWith(''))([]), []);
  eq(S.extend(S.joinWith(''))(['x']), ['x']);
  eq(S.extend(S.joinWith(''))(['x', 'y']), ['xy', 'y']);
  eq(S.extend(S.joinWith(''))(['x', 'y', 'z']), ['xyz', 'yz', 'z']);
//eq(S.extend(S.reduce(S.add)(1))(Identity(42)), Identity(43));

});
