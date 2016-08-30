
import $ from 'sanctuary-def'
import R from 'ramda'

//  List :: Type -> Type
export const List = $.UnaryType(
  'sanctuary/List',
  function(x) {
    return x != null &&
           R.type(x) !== 'Function' &&
           $.Integer._test(x.length) &&
           x.length >= 0;
  },
  function(list) {
    return list.length > 0 && R.type(list) !== 'String' ? [list[0]] : [];
  }
);
