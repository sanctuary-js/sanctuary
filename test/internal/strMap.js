const proto = Object.create (null);

Object.defineProperty (
  proto,
  'non-enumerable inherited property',
  {enumerable: false, value: 'non-enumerable inherited property'}
);
Object.defineProperty (
  proto,
  'enumerable inherited property',
  {enumerable: true, value: 'enumerable inherited property'}
);

const strMap = Object.create (proto);

Object.defineProperty (
  strMap,
  'non-enumerable own property',
  {enumerable: false, value: 'non-enumerable own property'}
);
Object.defineProperty (
  strMap,
  'enumerable own property',
  {enumerable: true, value: 'enumerable own property'}
);

export default strMap;
