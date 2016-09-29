
import { a, b } from './typeVariables'
import $ from 'sanctuary-def'
import { Accessible } from '../_internal/Types'
import R from 'ramda'
import { def } from './def'

//  prop :: Accessible a => String -> a -> b
export const prop =
def('prop',
    {a: [Accessible]},
    [$.String, a, b],
    function(key, obj) {
      var boxed = Object(obj);
      if (key in boxed) {
        return boxed[key];
      } else {
        throw new TypeError('‘prop’ expected object to have a property ' +
                            'named ‘' + key + '’; ' +
                            R.toString(obj) + ' does not');
      }
    });
