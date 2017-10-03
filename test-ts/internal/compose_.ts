export default function compose<B, C>(f: (b: B) => C) {
  return function<A>(g: (a: A) => B) {
    return function(a: A): C {
      return f(g(a));
    };
  };
}
