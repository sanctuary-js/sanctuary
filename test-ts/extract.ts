const S = require('../test/internal/sanctuary');

import Identity from './internal/Identity';
import eq from './internal/eq';


test('extract', () => {

  eq(typeof S.extract, 'function');
  eq(S.extract.length, 1);
  eq(S.extract.toString(), 'extract :: Comonad w => w a -> a');

  const of = Identity['fantasy-land/of'];

  eq(S.extract(of(42)), 42);

});
