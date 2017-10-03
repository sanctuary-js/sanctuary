import * as S from '..';

//import Identity from './internal/Identity';
import eq from './internal/eq';


test('sequence', () => {

  eq(typeof S.sequence, 'function');
  eq(S.sequence.length, 2);
  eq(S.sequence.toString(), 'sequence :: (Applicative f, Traversable t) => TypeRep f -> t (f a) -> f (t a)');

//eq(S.sequence(Identity)([]), Identity([]));
//eq(S.sequence(Identity)([Identity(1), Identity(2), Identity(3)]), Identity([1, 2, 3]));
//eq(S.sequence(Identity)({}), Identity({}));
//eq(S.sequence(Identity)({a: Identity(1), b: Identity(2), c: Identity(3)}), Identity({a: 1, b: 2, c: 3}));
//eq(S.sequence(Identity)(S.Nothing), Identity(S.Nothing));
//eq(S.sequence(Identity)(S.Just(Identity(0))), Identity(S.Just(0)));
//eq(S.sequence(Identity)(S.Left('A')), Identity(S.Left('A')));
//eq(S.sequence(Identity)(S.Right(Identity(-1))), Identity(S.Right(-1)));

//eq(S.sequence(Array)(Identity([])), []);
//eq(S.sequence(Array)(Identity([1, 2, 3])), [Identity(1), Identity(2), Identity(3)]);
//eq(S.sequence(S.Maybe)(Identity(S.Nothing)), S.Nothing);
//eq(S.sequence(S.Maybe)(Identity(S.Just(0))), S.Just(Identity(0)));
//eq(S.sequence(S.Either)(Identity(S.Left('A'))), S.Left('A'));
//eq(S.sequence(S.Either)(Identity(S.Right(-1))), S.Right(Identity(-1)));

});
