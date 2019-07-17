# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/objects/string_key_with_yield_values/generator/string_key_sans_yield_arg.md

> :: objects : string key with yield values : generator
>
> ::> string key sans yield arg

## Input

`````js
function *f(){   s = {"foo": yield}   }
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
  loc:{start:{line:1,col:0},end:{line:1,col:39},source:''},
  body: [
    {
      type: 'FunctionDeclaration',
      loc:{start:{line:1,col:0},end:{line:1,col:39},source:''},
      generator: true,
      async: false,
      id: {
        type: 'Identifier',
        loc:{start:{line:1,col:10},end:{line:1,col:10},source:''},
        name: 'f'
      },
      params: [],
      body: {
        type: 'BlockStatement',
        loc:{start:{line:1,col:13},end:{line:1,col:39},source:''},
        body: [
          {
            type: 'ExpressionStatement',
            loc:{start:{line:1,col:17},end:{line:1,col:38},source:''},
            expression: {
              type: 'AssignmentExpression',
              loc:{start:{line:1,col:17},end:{line:1,col:38},source:''},
              left: {
                type: 'Identifier',
                loc:{start:{line:1,col:17},end:{line:1,col:19},source:''},
                name: 's'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                loc:{start:{line:1,col:21},end:{line:1,col:38},source:''},
                properties: [
                  {
                    type: 'Property',
                    loc:{start:{line:1,col:22},end:{line:1,col:34},source:''},
                    key: {
                      type: 'Literal',
                      loc:{start:{line:1,col:22},end:{line:1,col:29},source:''},
                      value: 'foo',
                      raw: '"foo"'
                    },
                    kind: 'init',
                    method: false,
                    computed: false,
                    value: {
                      type: 'YieldExpression',
                      loc:{start:{line:1,col:29},end:{line:1,col:34},source:''},
                      delegate: false,
                      argument: null
                    },
                    shorthand: false
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

tokens (16x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT
       PUNCTUATOR PUNCTUATOR STRING_DOUBLE PUNCTUATOR IDENT PUNCTUATOR
       ASI PUNCTUATOR
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