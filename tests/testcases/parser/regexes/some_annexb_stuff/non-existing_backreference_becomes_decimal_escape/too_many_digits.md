# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/regexes/some_annexb_stuff/non-existing_backreference_becomes_decimal_escape/too_many_digits.md

> :: regexes : some annexb stuff : non-existing backreference becomes decimal escape
>
> ::> too many digits

## Input

`````js
/foo \1234 bar/
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Tokenizer error!
    Parsed too many digits

/foo \1234 bar/
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
ast: {
  type: 'Program',
  loc:{start:{line:1,col:0},end:{line:1,col:15},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:15},source:''},
      expression: {
        type: 'Literal',
        loc:{start:{line:1,col:0},end:{line:1,col:15},source:''},
        value: null,
        regex: { pattern: 'foo \\1234 bar', flags: '' },
        raw: '/foo \\1234 bar/'
      }
    }
  ]
}

tokens (3x):
       REGEX ASI
`````
