'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('contramap', () => {

  eq (String (S.contramap)) ('contramap :: Contravariant f => (b -> a) -> f a -> f b');

  eq (S.contramap (S.prop ('length')) (Math.sqrt) ('Sanctuary')) (3);

});
