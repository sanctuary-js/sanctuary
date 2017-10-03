import * as S from '..';

//import Identity from './internal/Identity';
import eq from './internal/eq';


test('extract', () => {

  eq(typeof S.extract, 'function');
  eq(S.extract.length, 1);
  eq(S.extract.toString(), 'extract :: Comonad w => w a -> a');

//eq(S.extract(Identity(42)), 42);

});
