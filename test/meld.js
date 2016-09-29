'use strict';

var eq = require('./utils').eq;
import * as S from '../src'


describe('meld', function() {

  it('is a unary function', function() {
    eq(typeof S.meld, 'function');
    eq(S.meld.length, 1);
  });

  it('composes a list of unary functions', function() {
    eq(S.meld([]).length, 1);
    eq(S.meld([])(99), 99);
    eq(S.meld([S.inc]).length, 1);
    eq(S.meld([S.inc])(99), 100);
    eq(S.meld([S.inc, Math.sqrt]).length, 1);
    eq(S.meld([S.inc, Math.sqrt])(99), 10);
    eq(S.meld([S.inc, Math.sqrt, S.dec]).length, 1);
    eq(S.meld([S.inc, Math.sqrt, S.dec])(99), 9);
  });

  it('melds a list of non-nullary functions of various arities', function() {
    var f = function(x) { return -x; };
    var g = function(x, y) { return Math.pow(x, y); };
    var h = function(x, y, z) { return x + y + z; };

    eq(S.meld([f, f, f]).length, 1);
    eq(S.meld([f, f, g]).length, 2);
    eq(S.meld([f, g, f]).length, 2);
    eq(S.meld([g, f, f]).length, 2);
    eq(S.meld([f, g, g]).length, 3);
    eq(S.meld([g, f, g]).length, 3);
    eq(S.meld([g, g, f]).length, 3);
    eq(S.meld([g, g, g]).length, 4);

    eq(S.meld([f, g, h]).length, 4);
    eq(S.meld([f, h, g]).length, 4);
    eq(S.meld([g, f, h]).length, 4);
    eq(S.meld([g, h, f]).length, 4);
    eq(S.meld([h, f, g]).length, 4);
    eq(S.meld([h, g, f]).length, 4);

    eq(S.meld([f, g, h])(3, 4, 5, 6), h(g(f(3), 4), 5, 6));
    eq(S.meld([f, h, g])(3, 4, 5, 6), g(h(f(3), 4, 5), 6));
    eq(S.meld([g, f, h])(3, 4, 5, 6), h(f(g(3, 4)), 5, 6));
    eq(S.meld([g, h, f])(3, 4, 5, 6), f(h(g(3, 4), 5, 6)));
    eq(S.meld([h, f, g])(3, 4, 5, 6), g(f(h(3, 4, 5)), 6));
    eq(S.meld([h, g, f])(3, 4, 5, 6), f(g(h(3, 4, 5), 6)));

    eq(S.meld([f, g, h])(3)(4)(5)(6), h(g(f(3), 4), 5, 6));
    eq(S.meld([f, h, g])(3)(4)(5)(6), g(h(f(3), 4, 5), 6));
    eq(S.meld([g, f, h])(3)(4)(5)(6), h(f(g(3, 4)), 5, 6));
    eq(S.meld([g, h, f])(3)(4)(5)(6), f(h(g(3, 4), 5, 6)));
    eq(S.meld([h, f, g])(3)(4)(5)(6), g(f(h(3, 4, 5)), 6));
    eq(S.meld([h, g, f])(3)(4)(5)(6), f(g(h(3, 4, 5), 6)));
  });

});
