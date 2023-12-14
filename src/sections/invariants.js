//. ### <span id="section:invariants">❑ Invariants</span>
//.
//. Sanctuary performs rigorous [type checking][] of inputs and outputs, and
//. throws a descriptive error if a type error is encountered. This allows bugs
//. to be caught and fixed early in the development cycle.
//.
//. Ramda operates on the [garbage in, garbage out][GIGO] principle. Functions
//. are documented to take arguments of particular types, but these invariants
//. are not enforced. The problem with this approach in a language as
//. permissive as JavaScript is that there's no guarantee that garbage input
//. will produce garbage output ([ramda/ramda#1413][]). Ramda performs ad hoc
//. type checking in some such cases ([ramda/ramda#1419][]).
//.
//. Sanctuary can be configured to operate in garbage in, garbage out mode.
//. Ramda cannot be configured to enforce its invariants.
