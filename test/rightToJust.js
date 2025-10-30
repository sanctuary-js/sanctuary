'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('rightToJust', () => {

  eq (S.show (S.rightToJust)) ('rightToJust :: Either a b -> Maybe b');

  eq (S.rightToJust (S.Left ('Cannot divide by zero'))) (S.Nothing);
  eq (S.rightToJust (S.Right (42))) (S.Just (42));

});
