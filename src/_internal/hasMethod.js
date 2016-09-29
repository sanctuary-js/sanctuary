
//  hasMethod :: String -> Any -> Boolean
export const hasMethod = function(name) {
  return function(x) {
    return x != null && typeof x[name] === 'function';
  };
};
