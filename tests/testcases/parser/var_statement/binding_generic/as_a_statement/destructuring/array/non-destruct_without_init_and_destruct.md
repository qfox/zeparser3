# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/var_statement/binding_generic/as_a_statement/destructuring/array/non-destruct_without_init_and_destruct.md

> :: var statement : binding generic : as a statement : destructuring : array
>
> ::> non-destruct without init and destruct

## Input

`````js
var foo, [bar] = arr2;
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
  loc:{start:{line:1,col:0},end:{line:1,col:22},source:''},
  body: [
    {
      type: 'VariableDeclaration',
      loc:{start:{line:1,col:4},end:{line:1,col:21},source:''},
      kind: 'var',
      declarations: [
        {
          type: 'VariableDeclarator',
          loc:{start:{line:1,col:4},end:{line:1,col:7},source:''},
          id: {
            type: 'Identifier',
            loc:{start:{line:1,col:4},end:{line:1,col:4},source:''},
            name: 'foo'
          },
          init: null
        },
        {
          type: 'VariableDeclarator',
          loc:{start:{line:1,col:9},end:{line:1,col:21},source:''},
          id: {
            type: 'ArrayPattern',
            loc:{start:{line:1,col:9},end:{line:1,col:15},source:''},
            elements: [
              {
                type: 'Identifier',
                loc:{start:{line:1,col:10},end:{line:1,col:13},source:''},
                name: 'bar'
              }
            ]
          },
          init: {
            type: 'Identifier',
            loc:{start:{line:1,col:17},end:{line:1,col:21},source:''},
            name: 'arr2'
          }
        }
      ]
    }
  ]
}

tokens (10x):
       IDENT IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       IDENT PUNCTUATOR
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