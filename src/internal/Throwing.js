import $ from 'sanctuary-def';
import show from 'sanctuary-show';

//  Throwing :: Type -> Type -> Type -> Type
//
//  `Throwing e a b` is the type of functions from `a` to `b` that may
//  throw values of type `e`.
export default E => A => B => {
  const T = $.Fn (A) (B);
  T.format = (outer, inner) => (
    outer ('Throwing ' + show (E)) +
    outer (' ') + inner ('$1') (show (A)) +
    outer (' ') + inner ('$2') (show (B))
  );
  return T;
};
