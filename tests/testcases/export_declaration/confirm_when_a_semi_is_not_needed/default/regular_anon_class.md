# ZeParser parser test case

- Path: tests/testcases/export_declaration/confirm_when_a_semi_is_not_needed/default/regular_anon_class.md

> :: export declaration : confirm when a semi is not needed : default
>
> ::> regular anon class

## Input

`````js
export default class {} foo
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  The `export` keyword can only be used with the module goal

export default class {} foo
^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

`````
ast: {
  type: 'Program',
  loc:{start:{line:1,column:0},end:{line:1,column:27},source:''},
  body: [
    {
      type: 'ExportDefaultDeclaration',
      loc:{start:{line:1,column:0},end:{line:1,column:23},source:''},
      declaration: {
        type: 'ClassDeclaration',
        loc:{start:{line:1,column:15},end:{line:1,column:23},source:''},
        id: null,
        superClass: null,
        body: {
          type: 'ClassBody',
          loc:{start:{line:1,column:21},end:{line:1,column:23},source:''},
          body: []
        }
      }
    },
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:24},end:{line:1,column:27},source:''},
      expression: {
        type: 'Identifier',
        loc:{start:{line:1,column:24},end:{line:1,column:27},source:''},
        name: 'foo'
      }
    }
  ]
}

tokens (8x):
       IDENT IDENT IDENT PUNCTUATOR PUNCTUATOR IDENT ASI
`````


### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._