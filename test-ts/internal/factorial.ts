export default function factorial(n: number): number {
  if (n < 0) {
    throw new Error('Cannot determine factorial of negative number');
  } else if (n === 0) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}
