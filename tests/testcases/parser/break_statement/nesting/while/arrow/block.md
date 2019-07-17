# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/break_statement/nesting/while/arrow/block.md

> :: break statement : nesting : while : arrow
>
> ::> block

## Input

`````js
() => { while (true)       { break }    }
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
  loc:{start:{line:1,col:0},end:{line:1,col:41},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:41},source:''},
      expression: {
        type: 'ArrowFunctionExpression',
        loc:{start:{line:1,col:0},end:{line:1,col:41},source:''},
        params: [],
        id: null,
        generator: false,
        async: false,
        expression: false,
        body: {
          type: 'BlockStatement',
          loc:{start:{line:1,col:6},end:{line:1,col:41},source:''},
          body: [
            {
              type: 'WhileStatement',
              loc:{start:{line:1,col:8},end:{line:1,col:40},source:''},
              test: {
                type: 'Literal',
                loc:{start:{line:1,col:15},end:{line:1,col:19},source:''},
                value: true,
                raw: 'true'
              },
              body: {
                type: 'BlockStatement',
                loc:{start:{line:1,col:27},end:{line:1,col:40},source:''},
                body: [
                  {
                    type: 'BreakStatement',
                    loc:{start:{line:1,col:29},end:{line:1,col:35},source:''},
                    label: null
                  }
                ]
              }
            }
          ]
        }
      }
    }
  ]
}

tokens (15x):
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
       IDENT PUNCTUATOR PUNCTUATOR IDENT ASI PUNCTUATOR PUNCTUATOR ASI
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