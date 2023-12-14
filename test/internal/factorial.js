//    factorial :: Throwing String Number Number
export default function factorial(n) {
  if (n < 0) {
    // eslint-disable-next-line no-throw-literal
    throw 'Cannot determine factorial of negative number';
  } else if (n === 0) {
    return 1;
  } else {
    return n * factorial (n - 1);
  }
}
