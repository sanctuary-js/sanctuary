
import R from 'ramda'

//  negativeZero :: a -> Boolean
export const negativeZero = R.either(R.equals(-0), R.equals(new Number(-0)));
