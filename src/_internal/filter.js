
//  filter :: (Monad m, Monoid m) => ((a -> Boolean), m a) -> m a
export const filter = function(pred, m) {
  return m.chain(function(x) {
    return pred(x) ? m.of(x) : m.empty();
  });
};
