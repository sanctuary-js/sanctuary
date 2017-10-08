import * as S from '..';

import eq from './internal/eq';
import rem from './internal/rem';


test('on', () => {

  eq(typeof S.on, 'function');
  eq(S.on.length, 4);
  eq(S.on.toString(), 'on :: (b -> b -> c) -> (a -> b) -> a -> a -> c');

  eq(S.on(rem)(S.prop('x'))({x: 5, y: 5})({x: 3, y: 3}), 2);
  eq(S.on<Array<number>, Array<number>, Array<number>>(S.concat)(S.reverse)([1, 2, 3])([4, 5, 6]), [3, 2, 1, 6, 5, 4]);

});
