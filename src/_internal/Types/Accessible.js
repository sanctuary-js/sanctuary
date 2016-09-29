
import $ from 'sanctuary-def'

//  Accessible :: TypeClass
export const Accessible = $.TypeClass(
  'sanctuary/Accessible',
  function(x) { return x != null; }
);
