import $ from 'sanctuary-def';

export default $.NullaryType
  ('Radix')
  ('')
  ([$.Integer])
  (x => x >= 2 && x <= 36);
