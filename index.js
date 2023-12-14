/*    #######
   ####     ####
 ####   ###   ####
#####   ###########   sanctuary
########   ########   noun
###########   #####   1 [ mass noun ] refuge from unsafe JavaScript
 ####   ###   ####
   ####     ####
      #######    */

/*
import                              from './src/sections/sanctuary.js';
*/

/*
import                              from './src/sections/folktale.js';
*/

/*
import                              from './src/sections/ramda.js';
import                              from './src/sections/totality.js';
import                              from './src/sections/information-preservation.js';
import                              from './src/sections/invariants.js';
import                              from './src/sections/currying.js';
import                              from './src/sections/variadic-functions.js';
import                              from './src/sections/implicit-context.js';
import                              from './src/sections/transducers.js';
import                              from './src/sections/modularity.js';
*/

/*
import                              from './src/sections/types.js';
*/

/*
import                              from './src/sections/type-checking.js';
*/

/*
import                              from './src/sections/installation.js';
*/

/*
import                              from './src/sections/api.js';
*/

/*
import                              from './src/sections/classify.js';
*/
export {default as type}            from './src/type.js';
export {default as is}              from './src/is.js';

/*
import                              from './src/sections/showable.js';
*/
export {default as show}            from './src/show.js';

/*
import                              from './src/sections/fantasy-land.js';
*/
export {default as equals}          from './src/equals.js';
export {default as lt}              from './src/lt.js';
export {default as lte}             from './src/lte.js';
export {default as gt}              from './src/gt.js';
export {default as gte}             from './src/gte.js';
export {default as min}             from './src/min.js';
export {default as max}             from './src/max.js';
export {default as clamp}           from './src/clamp.js';
export {default as id}              from './src/id.js';
export {default as concat}          from './src/concat.js';
export {default as empty}           from './src/empty.js';
export {default as invert}          from './src/invert.js';
export {default as filter}          from './src/filter.js';
export {default as reject}          from './src/reject.js';
export {default as map}             from './src/map.js';
export {default as flip}            from './src/flip.js';
export {default as bimap}           from './src/bimap.js';
export {default as mapLeft}         from './src/mapLeft.js';
export {default as promap}          from './src/promap.js';
export {default as alt}             from './src/alt.js';
export {default as zero}            from './src/zero.js';
export {default as reduce}          from './src/reduce.js';
export {default as reduce_}         from './src/reduce_.js';
export {default as traverse}        from './src/traverse.js';
export {default as sequence}        from './src/sequence.js';
export {default as ap}              from './src/ap.js';
export {default as lift2}           from './src/lift2.js';
export {default as lift3}           from './src/lift3.js';
export {default as apFirst}         from './src/apFirst.js';
export {default as apSecond}        from './src/apSecond.js';
export {default as of}              from './src/of.js';
export {default as chain}           from './src/chain.js';
export {default as join}            from './src/join.js';
export {default as chainRec}        from './src/chainRec.js';
export {default as extend}          from './src/extend.js';
export {default as duplicate}       from './src/duplicate.js';
export {default as extract}         from './src/extract.js';
export {default as contramap}       from './src/contramap.js';

/*
import                              from './src/sections/combinator.js';
*/
export {default as I}               from './src/I.js';
export {default as K}               from './src/K.js';
export {default as T}               from './src/T.js';

/*
import                              from './src/sections/composition.js';
*/
export {default as compose}         from './src/compose.js';
export {default as pipe}            from './src/pipe.js';
export {default as pipeK}           from './src/pipeK.js';
export {default as on}              from './src/on.js';

/*
import                              from './src/sections/pair.js';
*/
export {default as Pair}            from './src/Pair.js';
export {default as pair}            from './src/pair~.js';
export {default as fst}             from './src/fst.js';
export {default as snd}             from './src/snd.js';
export {default as swap}            from './src/swap.js';

/*
import                              from './src/sections/maybe.js';
*/
export {default as Maybe}           from './src/Maybe.js';
export {default as Nothing}         from './src/Nothing.js';
export {default as Just}            from './src/Just.js';
export {default as isNothing}       from './src/isNothing.js';
export {default as isJust}          from './src/isJust.js';
export {default as maybe}           from './src/maybe~.js';
export {default as maybe_}          from './src/maybe_.js';
export {default as fromMaybe}       from './src/fromMaybe.js';
export {default as fromMaybe_}      from './src/fromMaybe_.js';
export {default as justs}           from './src/justs.js';
export {default as mapMaybe}        from './src/mapMaybe.js';
export {default as maybeToNullable} from './src/maybeToNullable.js';

/*
import                              from './src/sections/either.js';
*/
export {default as Either}          from './src/Either.js';
export {default as Left}            from './src/Left.js';
export {default as Right}           from './src/Right.js';
export {default as isLeft}          from './src/isLeft.js';
export {default as isRight}         from './src/isRight.js';
export {default as either}          from './src/either~.js';
export {default as fromLeft}        from './src/fromLeft.js';
export {default as fromRight}       from './src/fromRight.js';
export {default as fromEither}      from './src/fromEither.js';
export {default as lefts}           from './src/lefts.js';
export {default as rights}          from './src/rights.js';
export {default as tagBy}           from './src/tagBy.js';
export {default as encase}          from './src/encase.js';

/*
import                              from './src/sections/logic.js';
*/
export {default as and}             from './src/and.js';
export {default as or}              from './src/or.js';
export {default as not}             from './src/not.js';
export {default as complement}      from './src/complement.js';
export {default as boolean}         from './src/boolean.js';
export {default as ifElse}          from './src/ifElse.js';
export {default as when}            from './src/when.js';
export {default as unless}          from './src/unless.js';

/*
import                              from './src/sections/array.js';
*/
export {default as array}           from './src/array.js';
export {default as head}            from './src/head.js';
export {default as last}            from './src/last.js';
export {default as tail}            from './src/tail.js';
export {default as init}            from './src/init.js';
export {default as take}            from './src/take.js';
export {default as drop}            from './src/drop.js';
export {default as takeLast}        from './src/takeLast.js';
export {default as dropLast}        from './src/dropLast.js';
export {default as takeWhile}       from './src/takeWhile.js';
export {default as dropWhile}       from './src/dropWhile.js';
export {default as size}            from './src/size.js';
export {default as all}             from './src/all.js';
export {default as any}             from './src/any.js';
export {default as none}            from './src/none.js';
export {default as append}          from './src/append.js';
export {default as prepend}         from './src/prepend.js';
export {default as joinWith}        from './src/joinWith.js';
export {default as elem}            from './src/elem.js';
export {default as elem_}           from './src/elem_.js';
export {default as find}            from './src/find.js';
export {default as findMap}         from './src/findMap.js';
export {default as intercalate}     from './src/intercalate.js';
export {default as foldMap}         from './src/foldMap.js';
export {default as unfold}          from './src/unfold.js';
export {default as range}           from './src/range.js';
export {default as groupBy}         from './src/groupBy.js';
export {default as reverse}         from './src/reverse.js';
export {default as sort}            from './src/sort.js';
export {default as sortBy}          from './src/sortBy.js';
export {default as zip}             from './src/zip.js';
export {default as zipWith}         from './src/zipWith.js';

/*
import                              from './src/sections/object.js';
*/
export {default as prop}            from './src/prop.js';
export {default as props}           from './src/props.js';
export {default as get}             from './src/get.js';
export {default as gets}            from './src/gets.js';

/*
import                              from './src/sections/strmap.js';
*/
export {default as value}           from './src/value.js';
export {default as singleton}       from './src/singleton.js';
export {default as insert}          from './src/insert.js';
export {default as remove}          from './src/remove.js';
export {default as keys}            from './src/keys.js';
export {default as values}          from './src/values.js';
export {default as pairs}           from './src/pairs.js';
export {default as fromPairs}       from './src/fromPairs.js';

/*
import                              from './src/sections/number.js';
*/
export {default as negate}          from './src/negate.js';
export {default as add}             from './src/add.js';
export {default as sum}             from './src/sum.js';
export {default as sub}             from './src/sub.js';
export {default as mult}            from './src/mult.js';
export {default as product}         from './src/product.js';
export {default as div}             from './src/div.js';
export {default as pow}             from './src/pow.js';

/*
import                              from './src/sections/integer.js';
*/
export {default as even}            from './src/even.js';
export {default as odd}             from './src/odd.js';

/*
import                              from './src/sections/parse.js';
*/
export {default as parseDate}       from './src/parseDate.js';
export {default as parseFloat}      from './src/parseFloat.js';
export {default as parseInt}        from './src/parseInt.js';
export {default as parseJson}       from './src/parseJson.js';

/*
import                              from './src/sections/regexp.js';
*/
export {default as regex}           from './src/regex.js';
export {default as regexEscape}     from './src/regexEscape.js';
export {default as test}            from './src/test.js';
export {default as match}           from './src/match.js';
export {default as matchAll}        from './src/matchAll.js';
export {default as replace}         from './src/replace.js';

/*
import                              from './src/sections/string.js';
*/
export {default as toUpper}         from './src/toUpper.js';
export {default as toLower}         from './src/toLower.js';
export {default as trim}            from './src/trim.js';
export {default as stripPrefix}     from './src/stripPrefix.js';
export {default as stripSuffix}     from './src/stripSuffix.js';
export {default as words}           from './src/words.js';
export {default as unwords}         from './src/unwords.js';
export {default as lines}           from './src/lines.js';
export {default as unlines}         from './src/unlines.js';
export {default as splitOn}         from './src/splitOn.js';
export {default as splitOnRegex}    from './src/splitOnRegex.js';

/*
import                              from './src/sections/_references.js';
*/
