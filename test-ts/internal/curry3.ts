export default function curry3<A, B, C, D>(f: (x: A, y: B, z: C) => D) {
  return function(x: A) {
    return function(y: B) {
      return function(z: C): D {
        return f(x, y, z);
      };
    };
  };
}
