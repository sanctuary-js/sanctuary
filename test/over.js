'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('over', () => {

  eq (S.show (S.over)) ('over :: Any -> Any -> Any -> Any');

  const snd = S.lens (S.snd) (x => S.map (S.K (x)));
  const fahrenheit = S.lens (c => c * 9 / 5 + 32) (f => c => (f - 32) * 5 / 9);

  // Increase the temperature in San Francisco by 1 °C
  eq (S.over (snd) (S.add (1)) (S.Pair ('San Francisco') (20)))
     (S.Pair ('San Francisco') (21));

  // 1 °F above freezing, in °C
  eq (S.over (fahrenheit) (S.add (1)) (0)) (0.5555555555555556);

  // 1 °F above freezing, in °F
  eq (S.view (fahrenheit) (S.over (fahrenheit) (S.add (1)) (0))) (33);

  // Decrease the temperature in San Francisco by 4 °F
  eq (S.over (S.compose (snd) (fahrenheit))
             (S.sub (4))
             (S.Pair ('San Francisco') (20)))
     (S.Pair ('San Francisco') (17.77777777777778));

});
