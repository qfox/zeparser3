# ZeParser parser test case

- Path: tests/testcases/yield/yield_star/yield_star_in.md

> :: yield : yield star
>
> ::> yield star in
>
> Regression caused the yield expression to be a `lhs` to the `in` where the `in` should actually the arg of the yield expression.

## Input

`````js
function* g() {
  yield * a in b;
}
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
  loc:{start:{line:1,column:0},end:{line:3,column:1},source:''},
  body: [
    {
      type: 'FunctionDeclaration',
      loc:{start:{line:1,column:0},end:{line:3,column:1},source:''},
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
        loc:{start:{line:1,column:14},end:{line:3,column:1},source:''},
        body: [
          {
            type: 'ExpressionStatement',
            loc:{start:{line:2,column:2},end:{line:2,column:17},source:''},
            expression: {
              type: 'YieldExpression',
              loc:{start:{line:2,column:2},end:{line:2,column:16},source:''},
              delegate: true,
              argument: {
                type: 'BinaryExpression',
                loc:{start:{line:2,column:10},end:{line:2,column:16},source:''},
                left: {
                  type: 'Identifier',
                  loc:{start:{line:2,column:10},end:{line:2,column:11},source:''},
                  name: 'a'
                },
                operator: 'in',
                right: {
                  type: 'Identifier',
                  loc:{start:{line:2,column:15},end:{line:2,column:16},source:''},
                  name: 'b'
                }
              }
            }
          }
        ]
      }
    }
  ]
}

tokens (14x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT
       PUNCTUATOR IDENT IDENT IDENT PUNCTUATOR PUNCTUATOR
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