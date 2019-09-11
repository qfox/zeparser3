# ZeParser parser test case

- Path: tests/testcases/yield/arg-less_yield_inside_group.md

> :: yield
>
> ::> arg-less yield inside group

## Input

`````js
({ *g1() {   (yield)  }})
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
  loc:{start:{line:1,column:0},end:{line:1,column:25},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:25},source:''},
      expression: {
        type: 'ObjectExpression',
        loc:{start:{line:1,column:1},end:{line:1,column:24},source:''},
        properties: [
          {
            type: 'Property',
            loc:{start:{line:1,column:3},end:{line:1,column:23},source:''},
            key: {
              type: 'Identifier',
              loc:{start:{line:1,column:4},end:{line:1,column:6},source:''},
              name: 'g1'
            },
            kind: 'init',
            method: true,
            computed: false,
            value: {
              type: 'FunctionExpression',
              loc:{start:{line:1,column:3},end:{line:1,column:23},source:''},
              generator: true,
              async: false,
              id: null,
              params: [],
              body: {
                type: 'BlockStatement',
                loc:{start:{line:1,column:9},end:{line:1,column:23},source:''},
                body: [
                  {
                    type: 'ExpressionStatement',
                    loc:{start:{line:1,column:13},end:{line:1,column:20},source:''},
                    expression: {
                      type: 'YieldExpression',
                      loc:{start:{line:1,column:14},end:{line:1,column:19},source:''},
                      delegate: false,
                      argument: null
                    }
                  }
                ]
              }
            },
            shorthand: false
          }
        ]
      }
    }
  ]
}

tokens (16x):
       PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR ASI PUNCTUATOR
       PUNCTUATOR PUNCTUATOR ASI
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