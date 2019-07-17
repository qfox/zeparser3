# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/regexes/some_annexb_stuff/octal_escape_in_char_class/web_compat_with_u-flag.md

> :: regexes : some annexb stuff : octal escape in char class
>
> ::> web compat with u-flag
> 
> https://tc39.github.io/ecma262/#prod-CharacterClass
> 
> https://tc39.github.io/ecma262/#prod-ClassRanges
> 
> https://tc39.github.io/ecma262/#prod-NonemptyClassRanges
> 
> NonemptyClassRanges is extended by annex B:
> 
>   https://tc39.github.io/ecma262/#sec-patterns-static-semantics-early-errors-annexb
> 
>   NonemptyClassRangesNoDash :: ClassAtomNoDash - ClassAtom ClassRanges
> 
> https://tc39.github.io/ecma262/#prod-annexB-ClassAtomNoDash
> 
> https://tc39.github.io/ecma262/#prod-annexB-ClassEscape
> 
> https://tc39.github.io/ecma262/#prod-annexB-CharacterEscape
> 
> https://tc39.github.io/ecma262/#prod-annexB-LegacyOctalEscapeSequence
> 
> note:
> 
> https://tc39.github.io/ecma262/#sec-literals-string-literals
> 
> A conforming implementation, when processing strict mode code, must not extend the syntax of EscapeSequence to include LegacyOctalEscapeSequence as described in B.1.2.

## Input


`````js
/[\12-\14]/u
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Tokenizer error!
    Encountered early EOF while parsing char class (3)

/[\12-\14]/u
^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

_Output same as sloppy mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

`````
throws: Tokenizer error!
    Regex had syntax that is invalid with u-flag and u-flag was in fact present

/[\12-\14]/u
^------- error
`````
