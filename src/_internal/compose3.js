
//  compose3 :: ((b -> c), (a -> b), a) -> c
export const compose3 = function(f, g, x) {
  return f(g(x));
};
