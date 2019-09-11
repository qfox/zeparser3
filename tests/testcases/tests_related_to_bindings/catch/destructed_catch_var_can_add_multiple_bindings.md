# ZeParser parser test case

- Path: tests/testcases/tests_related_to_bindings/catch/destructed_catch_var_can_add_multiple_bindings.md

> :: tests related to bindings : catch
>
> ::> destructed catch var can add multiple bindings

## Input

`````js
try {} catch ([a,b,c]) { }
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
  loc:{start:{line:1,column:0},end:{line:1,column:26},source:''},
  body: [
    {
      type: 'TryStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:26},source:''},
      block: {
        type: 'BlockStatement',
        loc:{start:{line:1,column:4},end:{line:1,column:6},source:''},
        body: []
      },
      handler: {
        type: 'CatchClause',
        loc:{start:{line:1,column:7},end:{line:1,column:26},source:''},
        param: {
          type: 'ArrayPattern',
          loc:{start:{line:1,column:14},end:{line:1,column:21},source:''},
          elements: [
            {
              type: 'Identifier',
              loc:{start:{line:1,column:15},end:{line:1,column:16},source:''},
              name: 'a'
            },
            {
              type: 'Identifier',
              loc:{start:{line:1,column:17},end:{line:1,column:18},source:''},
              name: 'b'
            },
            {
              type: 'Identifier',
              loc:{start:{line:1,column:19},end:{line:1,column:20},source:''},
              name: 'c'
            }
          ]
        },
        body: {
          type: 'BlockStatement',
          loc:{start:{line:1,column:23},end:{line:1,column:26},source:''},
          body: []
        }
      },
      finalizer: null
    }
  ]
}

tokens (16x):
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT
       PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
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