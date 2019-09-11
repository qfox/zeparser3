# ZeParser parser autogenerated test case

- From: tests/testcases/classes/extending/lefthandside/autogen.md
- Path: tests/testcases/classes/extending/lefthandside/gen/expression/async.md

> :: classes : extending : lefthandside : gen : expression
>
> ::> async

## Input


`````js
(class B extends async {})
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
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:26},source:''},
      expression: {
        type: 'ClassExpression',
        loc:{start:{line:1,column:1},end:{line:1,column:25},source:''},
        id: {
          type: 'Identifier',
          loc:{start:{line:1,column:7},end:{line:1,column:8},source:''},
          name: 'B'
        },
        superClass: {
          type: 'Identifier',
          loc:{start:{line:1,column:17},end:{line:1,column:22},source:''},
          name: 'async'
        },
        body: {
          type: 'ClassBody',
          loc:{start:{line:1,column:23},end:{line:1,column:25},source:''},
          body: []
        }
      }
    }
  ]
}

tokens (10x):
       PUNCTUATOR IDENT IDENT IDENT IDENT PUNCTUATOR PUNCTUATOR
       PUNCTUATOR ASI
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