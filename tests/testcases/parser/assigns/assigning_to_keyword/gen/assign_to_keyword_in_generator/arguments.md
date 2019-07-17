# ZeParser parser autogenerated test case

- From: zeparser3/tests/testcases/parser/assigns/assigning_to_keyword/autogen.md
- Path: zeparser3/tests/testcases/parser/assigns/assigning_to_keyword/gen/assign_to_keyword_in_generator

> :: test: assign to keyword in generator
>
> :: case: arguments

## Input


`````js
function *f(){
  arguments = 1;
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
  loc:{start:{line:1,col:0},end:{line:3,col:1},source:''},
  body: [
    {
      type: 'FunctionDeclaration',
      loc:{start:{line:1,col:0},end:{line:3,col:1},source:''},
      generator: true,
      async: false,
      id: {
        type: 'Identifier',
        loc:{start:{line:1,col:10},end:{line:1,col:10},source:''},
        name: 'f'
      },
      params: [],
      body: {
        type: 'BlockStatement',
        loc:{start:{line:1,col:13},end:{line:3,col:1},source:''},
        body: [
          {
            type: 'ExpressionStatement',
            loc:{start:{line:2,col:2},end:{line:3,col:0},source:''},
            expression: {
              type: 'AssignmentExpression',
              loc:{start:{line:2,col:2},end:{line:2,col:15},source:''},
              left: {
                type: 'Identifier',
                loc:{start:{line:2,col:2},end:{line:2,col:12},source:''},
                name: 'arguments'
              },
              operator: '=',
              right: {
                type: 'Literal',
                loc:{start:{line:2,col:14},end:{line:2,col:14},source:''},
                value: 1,
                raw: '1'
              }
            }
          }
        ]
      }
    }
  ]
}

tokens (12x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT
       PUNCTUATOR NUMBER_DEC PUNCTUATOR PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Cannot assign to `eval` and `arguments` in strict mode

function *f(){
  arguments = 1;
            ^------- error

}
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._