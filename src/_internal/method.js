
import $ from 'sanctuary-def'
import R from 'ramda'
import { def } from './def'

//  Note: Type checking of method arguments takes place once all arguments
//  have been provided (whereas function arguments are checked as early as
//  possible). This is not ideal, but provides two benefits:
//
//    - accurate type signatures in error messages (though "->" appears in
//      place of "~>"); and
//
//    - intuitive ordering (`a.m(b, c)` is checked in a-b-c order rather
//      than b-c-a order).
export const method = function(name, constraints, types, _f) {
  var f = def(name, constraints, types, _f);
  return def(name,
             constraints,
             R.repeat($.Any, types.length - 1),
             function() { return R.apply(f, R.prepend(this, arguments)); });
};
