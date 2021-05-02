'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('set', () => {

  eq (S.show (S.set)) ('set :: TK');

});
