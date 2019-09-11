# ZeParser parser autogenerated test case

- From: tests/testcases/functions/declaration/block_scoped/autogen.md
- Path: tests/testcases/functions/declaration/block_scoped/gen/switch_default_block/async_function_x002afx0028x0029x007bx007d.md

> :: functions : declaration : block scoped : gen : switch default block
>
> ::> async function x002afx0028x0029x007bx007d

## Input


`````js
switch (x) { default: async function *f(){} async function *f(){} }
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Attempted to create a lexical binding for `f` but another binding already existed on the same level

switch (x) { default: async function *f(){} async function *f(){} }
                                                            ^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

_Output same as sloppy mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

`````
ast: {
  type: 'Program',
  loc:{start:{line:1,column:0},end:{line:1,column:67},source:''},
  body: [
    {
      type: 'SwitchStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:67},source:''},
      discriminant: {
        type: 'Identifier',
        loc:{start:{line:1,column:8},end:{line:1,column:9},source:''},
        name: 'x'
      },
      cases: [
        {
          type: 'SwitchCase',
          loc:{start:{line:1,column:13},end:{line:1,column:65},source:''},
          test: null,
          consequent: [
            {
              type: 'FunctionDeclaration',
              loc:{start:{line:1,column:22},end:{line:1,column:43},source:''},
              generator: true,
              async: true,
              id: {
                type: 'Identifier',
                loc:{start:{line:1,column:38},end:{line:1,column:39},source:''},
                name: 'f'
              },
              params: [],
              body: {
                type: 'BlockStatement',
                loc:{start:{line:1,column:41},end:{line:1,column:43},source:''},
                body: []
              }
            },
            {
              type: 'FunctionDeclaration',
              loc:{start:{line:1,column:44},end:{line:1,column:65},source:''},
              generator: true,
              async: true,
              id: {
                type: 'Identifier',
                loc:{start:{line:1,column:60},end:{line:1,column:61},source:''},
                name: 'f'
              },
              params: [],
              body: {
                type: 'BlockStatement',
                loc:{start:{line:1,column:63},end:{line:1,column:65},source:''},
                body: []
              }
            }
          ]
        }
      ]
    }
  ]
}

tokens (25x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
       IDENT IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR IDENT IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       PUNCTUATOR PUNCTUATOR PUNCTUATOR
`````
