import * as S from '../..';

export default function squareRoot(n: number): any {
  return n < 0 ? S.Left('Cannot represent square root of negative number')
               : S.Right(Math.sqrt(n));
}
