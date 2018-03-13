export default function $<A>(x: A) {
  return function<B>(f: (x: A) => B): B {
    return f(x);
  };
}
