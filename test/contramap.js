'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('contramap', () => {

  eq (String (S.contramap), 'contramap :: Contravariant f => (b -> a) -> f a -> f b');

  eq (S.contramap (S.prop ('length')) (Math.sqrt) ('Sanctuary'), 3);

});
