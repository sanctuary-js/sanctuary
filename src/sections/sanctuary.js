//. # <span id="section:sanctuary">❑ Sanctuary</span>
//.
//. [![npm](https://img.shields.io/npm/v/sanctuary.svg)](https://www.npmjs.com/package/sanctuary)
//. [![CircleCI](https://img.shields.io/circleci/project/github/sanctuary-js/sanctuary/main.svg)](https://app.circleci.com/pipelines/github/sanctuary-js/sanctuary?branch=main)
//. [![Gitter](https://img.shields.io/gitter/room/badges/shields.svg)](https://gitter.im/sanctuary-js/sanctuary)
//.
//. Sanctuary is a JavaScript functional programming library inspired by
//. [Haskell][] and [PureScript][]. It's stricter than [Ramda][], and
//. provides a similar suite of functions.
//.
//. Sanctuary promotes programs composed of simple, pure functions. Such
//. programs are easier to comprehend, test, and maintain &ndash; they are
//. also a pleasure to write.
//.
//. Sanctuary provides two data types, [Maybe][] and [Either][], both of
//. which are compatible with [Fantasy Land][]. Thanks to these data types
//. even Sanctuary functions that may fail, such as [`head`](#head), are
//. composable.
//.
//. Sanctuary makes it possible to write safe code without null checks.
//. In JavaScript it's trivial to introduce a possible run-time type error:
//.
//.     words[0].toUpperCase()
//.
//. If `words` is `[]` we'll get a familiar error at run-time:
//.
//.     TypeError: Cannot read property 'toUpperCase' of undefined
//.
//. Sanctuary gives us a fighting chance of avoiding such errors. We might
//. write:
//.
//.     S.map (S.toUpper) (S.head (words))
//.
//. Sanctuary is designed to work in Node.js and in ES5-compatible browsers.
