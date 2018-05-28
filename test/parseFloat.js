'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('parseFloat', function() {

  eq (typeof S.parseFloat) ('function');
  eq (S.parseFloat.length) (1);
  eq (S.show (S.parseFloat)) ('parseFloat :: String -> Maybe Number');

  eq (S.parseFloat ('12.34')) (S.Just (12.34));
  eq (S.parseFloat ('Infinity')) (S.Just (Infinity));
  eq (S.parseFloat ('-Infinity')) (S.Just (-Infinity));
  eq (S.parseFloat ('NaN')) (S.Just (NaN));
  eq (S.parseFloat ('-NaN')) (S.Just (NaN));  // Haskell accepts "-NaN"
  eq (S.parseFloat ('0')) (S.Just (0));
  eq (S.parseFloat ('-0')) (S.Just (-0));
  eq (S.parseFloat ('42')) (S.Just (42));
  eq (S.parseFloat ('42.')) (S.Just (42));
  eq (S.parseFloat ('0.5')) (S.Just (0.5));
  eq (S.parseFloat ('.25')) (S.Just (0.25));
  eq (S.parseFloat ('+42')) (S.Just (42));
  eq (S.parseFloat ('+42.')) (S.Just (42));
  eq (S.parseFloat ('+0.5')) (S.Just (0.5));
  eq (S.parseFloat ('+.25')) (S.Just (0.25));
  eq (S.parseFloat ('-42')) (S.Just (-42));
  eq (S.parseFloat ('-42.')) (S.Just (-42));
  eq (S.parseFloat ('-0.5')) (S.Just (-0.5));
  eq (S.parseFloat ('-.25')) (S.Just (-0.25));
  eq (S.parseFloat ('0.5 ')) (S.Just (0.5));
  eq (S.parseFloat (' 0.5')) (S.Just (0.5));
  eq (S.parseFloat ('0.5x')) (S.Nothing);  // parseFloat ('0.5x') == 0.5
  eq (S.parseFloat ('x0.5')) (S.Nothing);
  eq (S.parseFloat ('-1e3')) (S.Just (-1000));
  eq (S.parseFloat ('-1e03')) (S.Just (-1000));
  eq (S.parseFloat ('-1e+3')) (S.Just (-1000));
  eq (S.parseFloat ('-1e+03')) (S.Just (-1000));
  eq (S.parseFloat ('-1e-3')) (S.Just (-0.001));
  eq (S.parseFloat ('-1e-03')) (S.Just (-0.001));
  eq (S.parseFloat ('xxx')) (S.Nothing);

});
