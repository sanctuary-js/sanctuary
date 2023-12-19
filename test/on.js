'use strict';

const S = require ('..');

const eq = require ('./internal/eq');
const rem = require ('./internal/rem');


test ('on', () => {

  eq (String (S.on)) ('on :: (b -> b -> c) -> (a -> b) -> a -> a -> c');

  eq (S.on (rem) (S.prop ('x')) ({x: 5, y: 5}) ({x: 3, y: 3})) (2);
  eq (S.on (S.concat) (S.reverse) ([1, 2, 3]) ([4, 5, 6])) ([3, 2, 1, 6, 5, 4]);

});
