'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('leftToJust', () => {

  eq (S.show (S.leftToJust)) ('leftToJust :: Either a b -> Maybe a');

  eq (S.leftToJust (S.Left ('Cannot divide by zero'))) (S.Just ('Cannot divide by zero'));
  eq (S.leftToJust (S.Right (42))) (S.Nothing);

});
