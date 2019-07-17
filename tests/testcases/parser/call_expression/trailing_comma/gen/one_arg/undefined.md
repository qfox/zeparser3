# ZeParser parser autogenerated test case

- From: zeparser3/tests/testcases/parser/call_expression/trailing_comma/autogen.md
- Path: zeparser3/tests/testcases/parser/call_expression/trailing_comma/gen/one_arg

> :: test: one arg
>
> :: case: undefined

## Input

- `es = undefined`

`````js
foo(x,);
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
  loc:{start:{line:1,col:0},end:{line:1,col:8},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:8},source:''},
      expression: {
        type: 'CallExpression',
        loc:{start:{line:1,col:0},end:{line:1,col:7},source:''},
        callee: {
          type: 'Identifier',
          loc:{start:{line:1,col:0},end:{line:1,col:3},source:''},
          name: 'foo'
        },
        arguments: [
          {
            type: 'Identifier',
            loc:{start:{line:1,col:4},end:{line:1,col:5},source:''},
            name: 'x'
          }
        ]
      }
    }
  ]
}

tokens (7x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
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