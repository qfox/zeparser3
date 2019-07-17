# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/async_keyword/as_ident_with_comma_on_top_level.md

> :: async keyword
>
> ::> as ident with comma on top level

## Input

`````js
async, b
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
ast: {
  type: 'Program',
  loc:{start:{line:1,col:0},end:{line:1,col:8},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:8},source:''},
      expression: {
        type: 'SequenceExpression',
        loc:{start:{line:1,col:0},end:{line:1,col:8},source:''},
        expressions: [
          {
            type: 'Identifier',
            loc:{start:{line:1,col:0},end:{line:1,col:5},source:''},
            name: 'async'
          },
          {
            type: 'Identifier',
            loc:{start:{line:1,col:7},end:{line:1,col:8},source:''},
            name: 'b'
          }
        ]
      }
    }
  ]
}

tokens (5x):
       IDENT PUNCTUATOR IDENT ASI
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

_Output same as sloppy mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._