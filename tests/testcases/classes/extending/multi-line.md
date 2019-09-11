# ZeParser parser test case

- Path: tests/testcases/classes/extending/multi-line.md

> :: classes : extending
>
> ::> multi-line
>
> Assert the location properly spanning multiple lines

## Input

`````js
class C extends (
  a,
  c
) {
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
  loc:{start:{line:1,column:0},end:{line:5,column:1},source:''},
  body: [
    {
      type: 'ClassDeclaration',
      loc:{start:{line:1,column:0},end:{line:5,column:1},source:''},
      id: {
        type: 'Identifier',
        loc:{start:{line:1,column:6},end:{line:1,column:7},source:''},
        name: 'C'
      },
      superClass: {
        type: 'SequenceExpression',
        loc:{start:{line:2,column:2},end:{line:3,column:3},source:''},
        expressions: [
          {
            type: 'Identifier',
            loc:{start:{line:2,column:2},end:{line:2,column:3},source:''},
            name: 'a'
          },
          {
            type: 'Identifier',
            loc:{start:{line:3,column:2},end:{line:3,column:3},source:''},
            name: 'c'
          }
        ]
      },
      body: {
        type: 'ClassBody',
        loc:{start:{line:4,column:2},end:{line:5,column:1},source:''},
        body: []
      }
    }
  ]
}

tokens (11x):
       IDENT IDENT IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
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