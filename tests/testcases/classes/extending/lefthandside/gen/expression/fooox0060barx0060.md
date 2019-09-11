# ZeParser parser autogenerated test case

- From: tests/testcases/classes/extending/lefthandside/autogen.md
- Path: tests/testcases/classes/extending/lefthandside/gen/expression/fooox0060barx0060.md

> :: classes : extending : lefthandside : gen : expression
>
> ::> fooox0060barx0060

## Input


`````js
(class B extends fooo`bar` {})
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
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:30},source:''},
      expression: {
        type: 'ClassExpression',
        loc:{start:{line:1,column:1},end:{line:1,column:29},source:''},
        id: {
          type: 'Identifier',
          loc:{start:{line:1,column:7},end:{line:1,column:8},source:''},
          name: 'B'
        },
        superClass: {
          type: 'TaggedTemplateExpression',
          loc:{start:{line:1,column:17},end:{line:1,column:26},source:''},
          tag: {
            type: 'Identifier',
            loc:{start:{line:1,column:17},end:{line:1,column:21},source:''},
            name: 'fooo'
          },
          quasi: {
            type: 'TemplateLiteral',
            loc:{start:{line:1,column:21},end:{line:1,column:26},source:''},
            expressions: [],
            quasis: [
              {
                type: 'TemplateElement',
                loc:{start:{line:1,column:22},end:{line:1,column:25},source:''},
                tail: true,
                value: { raw: 'bar', cooked: 'bar' }
              }
            ]
          }
        },
        body: {
          type: 'ClassBody',
          loc:{start:{line:1,column:27},end:{line:1,column:29},source:''},
          body: []
        }
      }
    }
  ]
}

tokens (11x):
       PUNCTUATOR IDENT IDENT IDENT IDENT TICK_PURE PUNCTUATOR
       PUNCTUATOR PUNCTUATOR ASI
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