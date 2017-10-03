export default function rem(x: number): (y: number) => number {
  return function(y) {
    if (y === 0) {
      throw new Error('Cannot divide by zero');
    } else {
      return x % y;
    }
  };
}
