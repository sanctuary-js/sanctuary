export default function area(a: number): (b: number) => (c: number) => number {
  return function(b) {
    return function(c) {
      if (Math.max(a, b, c) < (a + b + c) / 2) {
        var s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
      } else {
        throw new Error('Impossible triangle');
      }
    };
  };
}
