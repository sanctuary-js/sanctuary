//. ## <span id="section:ramda">❑ Ramda</span>
//.
//. [Ramda][] provides several functions that return problematic values
//. such as `undefined`, `Infinity`, or `NaN` when applied to unsuitable
//. inputs. These are known as [partial functions][]. Partial functions
//. necessitate the use of guards or null checks. In order to safely use
//. `R.head`, for example, one must ensure that the array is non-empty:
//.
//.     if (R.isEmpty (xs)) {
//.       // ...
//.     } else {
//.       return f (R.head (xs));
//.     }
//.
//. Using the Maybe type renders such guards (and null checks) unnecessary.
//. Changing functions such as `R.head` to return Maybe values was proposed
//. in [ramda/ramda#683][], but was considered too much of a stretch for
//. JavaScript programmers. Sanctuary was released the following month,
//. in January 2015, as a companion library to Ramda.
//.
//. In addition to broadening in scope in the years since its release,
//. Sanctuary's philosophy has diverged from Ramda's in several respects.
