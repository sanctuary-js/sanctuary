
//  compose2 :: ((b -> c), (a -> b)) -> a -> c
export const compose2 = function(f, g) {
  return function(x) {
    return f(g(x));
  };
};
