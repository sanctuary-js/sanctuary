'use strict';

var S = require ('./internal/sanctuary');

var Sum = require ('./internal/Sum');
var eq = require ('./internal/eq');


test ('invert', function() {

  eq (typeof S.invert) ('function');
  eq (S.invert.length) (1);
  eq (S.show (S.invert)) ('invert :: Group g => g -> g');

  eq (S.invert (Sum (5))) (Sum (-5));
  eq (S.invert (Sum (-5))) (Sum (5));

});
