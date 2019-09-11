# ZeParser parser test case

- Path: tests/testcases/yield/inside_a_non-generator_function/as_a_statement/sans_arg.md

> :: yield : inside a non-generator function : as a statement
>
> ::> sans arg

## Input

`````js
function f(){ yield; }
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
  loc:{start:{line:1,column:0},end:{line:1,column:22},source:''},
  body: [
    {
      type: 'FunctionDeclaration',
      loc:{start:{line:1,column:0},end:{line:1,column:22},source:''},
      generator: false,
      async: false,
      id: {
        type: 'Identifier',
        loc:{start:{line:1,column:9},end:{line:1,column:10},source:''},
        name: 'f'
      },
      params: [],
      body: {
        type: 'BlockStatement',
        loc:{start:{line:1,column:12},end:{line:1,column:22},source:''},
        body: [
          {
            type: 'ExpressionStatement',
            loc:{start:{line:1,column:14},end:{line:1,column:20},source:''},
            expression: {
              type: 'Identifier',
              loc:{start:{line:1,column:14},end:{line:1,column:19},source:''},
              name: 'yield'
            }
          }
        ]
      }
    }
  ]
}

tokens (9x):
       IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Cannot use `yield` outside of generator functions when in strict mode

function f(){ yield; }
                   ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._