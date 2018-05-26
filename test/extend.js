'use strict';

var Identity = require ('sanctuary-identity');

var S = require ('./internal/sanctuary');

var eq = require ('./internal/eq');


test ('extend', function() {

  eq (typeof S.extend) ('function');
  eq (S.extend.length) (1);
  eq (String (S.extend)) ('extend :: Extend w => (w a -> b) -> w a -> w b');

  eq (S.extend (S.joinWith ('')) ([])) ([]);
  eq (S.extend (S.joinWith ('')) (['x'])) (['x']);
  eq (S.extend (S.joinWith ('')) (['x', 'y'])) (['xy', 'y']);
  eq (S.extend (S.joinWith ('')) (['x', 'y', 'z'])) (['xyz', 'yz', 'z']);
  eq (S.extend (S.reduce (S.add) (1)) (Identity (42))) (Identity (43));
  eq (S.extend (S.T ([3, 4])) (S.reverse) ([1, 2])) ([4, 3, 2, 1]);

});
