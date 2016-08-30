
import $ from 'sanctuary-def'

//  $Maybe :: Type -> Type
export const $Maybe = $.UnaryType(
  'sanctuary/Maybe',
  function(x) { return x != null && x['@@type'] === 'sanctuary/Maybe'; },
  function(maybe) { return maybe.isJust ? [maybe.value] : []; }
);
