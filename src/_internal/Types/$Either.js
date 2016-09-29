
import $ from 'sanctuary-def'

//  $Either :: Type -> Type -> Type
export const $Either = $.BinaryType(
  'sanctuary/Either',
  function(x) { return x != null && x['@@type'] === 'sanctuary/Either'; },
  function(either) { return either.isLeft ? [either.value] : []; },
  function(either) { return either.isRight ? [either.value] : []; }
);
