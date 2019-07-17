# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/let_declaration/binding_generic/in_a_for-header/regular_vars/regular_for-loop/var_on_next_line_does_not_trigger_asi.md

> :: let declaration : binding generic : in a for-header : regular vars : regular for-loop
>
> ::> var on next line does not trigger asi

## Input

`````js
for (let
foo;;);
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
  loc:{start:{line:1,col:0},end:{line:2,col:7},source:''},
  body: [
    {
      type: 'ForStatement',
      loc:{start:{line:1,col:0},end:{line:2,col:7},source:''},
      init: {
        type: 'VariableDeclaration',
        loc:{start:{line:2,col:0},end:{line:2,col:3},source:''},
        kind: 'let',
        declarations: [
          {
            type: 'VariableDeclarator',
            loc:{start:{line:2,col:0},end:{line:2,col:3},source:''},
            id: {
              type: 'Identifier',
              loc:{start:{line:2,col:0},end:{line:2,col:0},source:''},
              name: 'foo'
            },
            init: null
          }
        ]
      },
      test: null,
      update: null,
      body: {
        type: 'EmptyStatement',
        loc:{start:{line:2,col:6},end:{line:2,col:7},source:''}
      }
    }
  ]
}

tokens (9x):
       IDENT PUNCTUATOR IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR
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