'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('view', () => {

  eq (S.show (S.view)) ('view :: Any -> Any -> Any');

  const snd = S.lens (S.snd) (x => S.map (S.K (x)));
  const fahrenheit = S.lens (c => c * 9 / 5 + 32) (f => c => (f - 32) * 5 / 9);

  eq (S.view (snd) (S.Pair ('San Francisco') (20))) (20);

  eq (S.view (fahrenheit) (0)) (32);
  eq (S.view (fahrenheit) (50)) (122);
  eq (S.view (fahrenheit) (100)) (212);

  // Temperature in San Francisco, converted to °F
  eq (S.view (S.compose (snd) (fahrenheit))
             (S.Pair ('San Francisco') (20)))
     (68);

  // Lenses compose via function composition
  eq (S.view (x => snd (fahrenheit (x)))
             (S.Pair ('San Francisco') (20)))
     (68);

});
