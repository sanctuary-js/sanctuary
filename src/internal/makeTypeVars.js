import $ from 'sanctuary-def';

const constructors = [
  $.TypeVariable,
  $.UnaryTypeVariable,
  $.BinaryTypeVariable,
];

export default spec => {
  const typeVars = Object.create (null);
  for (const [name, arity] of Object.entries (spec)) {
    typeVars[name] = constructors[arity] (name);
  }
  return typeVars;
};
