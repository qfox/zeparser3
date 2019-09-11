# ZeParser parser autogenerated test case

- From: tests/testcases/let_declaration/sub_tree/autogen.md
- Path: tests/testcases/let_declaration/sub_tree/gen/default/let_x.md

> :: let declaration : sub tree : gen : default
>
> ::> let x

## Input


`````js
switch (a) { default: let x }
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
  loc:{start:{line:1,column:0},end:{line:1,column:29},source:''},
  body: [
    {
      type: 'SwitchStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:29},source:''},
      discriminant: {
        type: 'Identifier',
        loc:{start:{line:1,column:8},end:{line:1,column:9},source:''},
        name: 'a'
      },
      cases: [
        {
          type: 'SwitchCase',
          loc:{start:{line:1,column:13},end:{line:1,column:27},source:''},
          test: null,
          consequent: [
            {
              type: 'VariableDeclaration',
              loc:{start:{line:1,column:22},end:{line:1,column:27},source:''},
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  loc:{start:{line:1,column:26},end:{line:1,column:27},source:''},
                  id: {
                    type: 'Identifier',
                    loc:{start:{line:1,column:26},end:{line:1,column:27},source:''},
                    name: 'x'
                  },
                  init: null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

tokens (12x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
       IDENT IDENT ASI PUNCTUATOR
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