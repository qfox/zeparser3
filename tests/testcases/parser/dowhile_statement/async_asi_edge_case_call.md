# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/dowhile_statement/async_asi_edge_case_call.md

> :: dowhile statement
>
> ::> async asi edge case call
>
> such sad. not an error, just `async()` func call and legit

## Input

`````js
do async 
 () 
 while (y)
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
  loc:{start:{line:1,col:0},end:{line:3,col:10},source:''},
  body: [
    {
      type: 'DoWhileStatement',
      loc:{start:{line:1,col:0},end:{line:3,col:10},source:''},
      body: {
        type: 'ExpressionStatement',
        loc:{start:{line:1,col:3},end:{line:3,col:1},source:''},
        expression: {
          type: 'CallExpression',
          loc:{start:{line:1,col:3},end:{line:3,col:1},source:''},
          callee: {
            type: 'Identifier',
            loc:{start:{line:1,col:3},end:{line:3,col:1},source:''},
            name: 'async'
          },
          arguments: []
        }
      },
      test: {
        type: 'Identifier',
        loc:{start:{line:3,col:8},end:{line:3,col:9},source:''},
        name: 'y'
      }
    }
  ]
}

tokens (11x):
       IDENT IDENT PUNCTUATOR PUNCTUATOR ASI IDENT PUNCTUATOR IDENT
       PUNCTUATOR ASI
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