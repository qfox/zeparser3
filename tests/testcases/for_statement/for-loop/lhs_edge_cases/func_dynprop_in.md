# ZeParser parser test case

- Path: tests/testcases/for_statement/for-loop/lhs_edge_cases/func_dynprop_in.md

> :: for statement : for-loop : lhs edge cases
>
> ::> func dynprop in
>
> The for-in flag should be reset inside the dynamic property

## PASS

## Input

`````js
for (function(){ }[x in y];;);
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
  loc:{start:{line:1,column:0},end:{line:1,column:30},source:''},
  body: [
    {
      type: 'ForStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:30},source:''},
      init: {
        type: 'MemberExpression',
        loc:{start:{line:1,column:5},end:{line:1,column:26},source:''},
        object: {
          type: 'FunctionExpression',
          loc:{start:{line:1,column:5},end:{line:1,column:18},source:''},
          generator: false,
          async: false,
          id: null,
          params: [],
          body: {
            type: 'BlockStatement',
            loc:{start:{line:1,column:15},end:{line:1,column:18},source:''},
            body: []
          }
        },
        property: {
          type: 'BinaryExpression',
          loc:{start:{line:1,column:19},end:{line:1,column:25},source:''},
          left: {
            type: 'Identifier',
            loc:{start:{line:1,column:19},end:{line:1,column:20},source:''},
            name: 'x'
          },
          operator: 'in',
          right: {
            type: 'Identifier',
            loc:{start:{line:1,column:24},end:{line:1,column:25},source:''},
            name: 'y'
          }
        },
        computed: true
      },
      test: null,
      update: null,
      body: {
        type: 'EmptyStatement',
        loc:{start:{line:1,column:29},end:{line:1,column:30},source:''}
      }
    }
  ]
}

tokens (17x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR PUNCTUATOR IDENT IDENT IDENT PUNCTUATOR PUNCTUATOR
       PUNCTUATOR PUNCTUATOR PUNCTUATOR
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