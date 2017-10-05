const S = require('../test/internal/sanctuary');

import Identity from './internal/Identity';
import eq from './internal/eq';


test('sequence', () => {

  eq(typeof S.sequence, 'function');
  eq(S.sequence.length, 2);
  eq(S.sequence.toString(), 'sequence :: (Applicative f, Traversable t) => TypeRep f -> t (f a) -> f (t a)');

  const of = Identity['fantasy-land/of'];

  eq(S.sequence(Identity)([]), of([]));
  eq(S.sequence(Identity)([of(1), of(2), of(3)]), of([1, 2, 3]));
  eq(S.sequence(Identity)({}), of({}));
  eq(S.sequence(Identity)({a: of(1), b: of(2), c: of(3)}), of({a: 1, b: 2, c: 3}));
  eq(S.sequence(Identity)(S.Nothing), of(S.Nothing));
  eq(S.sequence(Identity)(S.Just(of(0))), of(S.Just(0)));
  eq(S.sequence(Identity)(S.Left('A')), of(S.Left('A')));
  eq(S.sequence(Identity)(S.Right(of(-1))), of(S.Right(-1)));

  eq(S.sequence(Array)(of([])), []);
  eq(S.sequence(Array)(of([1, 2, 3])), [of(1), of(2), of(3)]);
  eq(S.sequence(S.Maybe)(of(S.Nothing)), S.Nothing);
  eq(S.sequence(S.Maybe)(of(S.Just(0))), S.Just(of(0)));
  eq(S.sequence(S.Either)(of(S.Left('A'))), S.Left('A'));
  eq(S.sequence(S.Either)(of(S.Right(-1))), S.Right(of(-1)));

});
