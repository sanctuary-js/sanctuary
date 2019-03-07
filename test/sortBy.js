'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('sortBy', () => {

  eq (typeof S.sortBy) ('function');
  eq (S.sortBy.length) (1);
  eq (S.show (S.sortBy)) ('sortBy :: (Ord b, Applicative m, Foldable m, Monoid m) => (a -> b) -> m a -> m a');

  eq (S.sortBy (S.I) ([])) ([]);
  eq (S.sortBy (S.I) (['five'])) (['five']);
  eq (S.sortBy (S.I) (['five', 'six'])) (['five', 'six']);
  eq (S.sortBy (S.I) (['five', 'six', 'seven'])) (['five', 'seven', 'six']);
  eq (S.sortBy (S.prop ('length')) (['five', 'six', 'seven'])) (['six', 'five', 'seven']);

  const _7s = {rank: 7, suit: 's'};
  const _5h = {rank: 5, suit: 'h'};
  const _2h = {rank: 2, suit: 'h'};
  const _5s = {rank: 5, suit: 's'};
  eq (S.sortBy (S.prop ('rank')) ([_7s, _5h, _2h, _5s])) ([_2h, _5h, _5s, _7s]);
  eq (S.sortBy (S.prop ('rank')) ([_7s, _5s, _2h, _5h])) ([_2h, _5s, _5h, _7s]);
  eq (S.sortBy (S.prop ('suit')) ([_7s, _5h, _2h, _5s])) ([_5h, _2h, _7s, _5s]);
  eq (S.sortBy (S.prop ('suit')) ([_5s, _2h, _5h, _7s])) ([_2h, _5h, _5s, _7s]);

});
