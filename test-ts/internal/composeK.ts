const chain = require('./chain');

//  composeK :: Chain m => (b -> m c) -> (a -> m b) -> a -> m c
//
//  Right-to-left Kleisli composition. Equivalent to Haskell's (<=<) function.
export default function composeK(f: any) {
  return function(g: any) {
    return function(x: any): any {
      return chain(f)(g(x));
    };
  };
}
