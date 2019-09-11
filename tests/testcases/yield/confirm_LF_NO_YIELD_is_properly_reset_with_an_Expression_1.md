# ZeParser parser test case

- Path: tests/testcases/yield/confirm_LF_NO_YIELD_is_properly_reset_with_an_Expression_1.md

> :: yield
>
> ::> confirm LF NO YIELD is properly reset with an Expression 1

## Input

`````js
function *g(){ return x + f(yield f); }
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
  loc:{start:{line:1,column:0},end:{line:1,column:39},source:''},
  body: [
    {
      type: 'FunctionDeclaration',
      loc:{start:{line:1,column:0},end:{line:1,column:39},source:''},
      generator: true,
      async: false,
      id: {
        type: 'Identifier',
        loc:{start:{line:1,column:10},end:{line:1,column:11},source:''},
        name: 'g'
      },
      params: [],
      body: {
        type: 'BlockStatement',
        loc:{start:{line:1,column:13},end:{line:1,column:39},source:''},
        body: [
          {
            type: 'ReturnStatement',
            loc:{start:{line:1,column:15},end:{line:1,column:37},source:''},
            argument: {
              type: 'BinaryExpression',
              loc:{start:{line:1,column:22},end:{line:1,column:36},source:''},
              left: {
                type: 'Identifier',
                loc:{start:{line:1,column:22},end:{line:1,column:23},source:''},
                name: 'x'
              },
              operator: '+',
              right: {
                type: 'CallExpression',
                loc:{start:{line:1,column:26},end:{line:1,column:36},source:''},
                callee: {
                  type: 'Identifier',
                  loc:{start:{line:1,column:26},end:{line:1,column:27},source:''},
                  name: 'f'
                },
                arguments: [
                  {
                    type: 'YieldExpression',
                    loc:{start:{line:1,column:28},end:{line:1,column:35},source:''},
                    delegate: false,
                    argument: {
                      type: 'Identifier',
                      loc:{start:{line:1,column:34},end:{line:1,column:35},source:''},
                      name: 'f'
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    }
  ]
}

tokens (17x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT
       IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT IDENT PUNCTUATOR
       PUNCTUATOR PUNCTUATOR
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