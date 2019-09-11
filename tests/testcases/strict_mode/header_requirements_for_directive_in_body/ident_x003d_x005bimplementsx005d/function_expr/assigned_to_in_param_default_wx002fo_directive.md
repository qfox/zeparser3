# ZeParser parser test case

- Path: tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bimplementsx005d/function_expr/assigned_to_in_param_default_wx002fo_directive.md

> :: strict mode : header requirements for directive in body : ident x003d x005bimplementsx005d : function expr
>
> ::> assigned to in param default wx002fo directive
>
> the default causes the error, not the usage, but whatever

## Input

`````js
f = function f(x=implements=10){ }
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
  loc:{start:{line:1,column:0},end:{line:1,column:34},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:34},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,column:0},end:{line:1,column:34},source:''},
        left: {
          type: 'Identifier',
          loc:{start:{line:1,column:0},end:{line:1,column:1},source:''},
          name: 'f'
        },
        operator: '=',
        right: {
          type: 'FunctionExpression',
          loc:{start:{line:1,column:4},end:{line:1,column:34},source:''},
          generator: false,
          async: false,
          id: {
            type: 'Identifier',
            loc:{start:{line:1,column:13},end:{line:1,column:14},source:''},
            name: 'f'
          },
          params: [
            {
              type: 'AssignmentPattern',
              loc:{start:{line:1,column:15},end:{line:1,column:30},source:''},
              left: {
                type: 'Identifier',
                loc:{start:{line:1,column:15},end:{line:1,column:16},source:''},
                name: 'x'
              },
              right: {
                type: 'AssignmentExpression',
                loc:{start:{line:1,column:17},end:{line:1,column:30},source:''},
                left: {
                  type: 'Identifier',
                  loc:{start:{line:1,column:17},end:{line:1,column:27},source:''},
                  name: 'implements'
                },
                operator: '=',
                right: {
                  type: 'Literal',
                  loc:{start:{line:1,column:28},end:{line:1,column:30},source:''},
                  value: 10,
                  raw: '10'
                }
              }
            }
          ],
          body: {
            type: 'BlockStatement',
            loc:{start:{line:1,column:31},end:{line:1,column:34},source:''},
            body: []
          }
        }
      }
    }
  ]
}

tokens (15x):
       IDENT PUNCTUATOR IDENT IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR NUMBER_DEC PUNCTUATOR PUNCTUATOR PUNCTUATOR ASI
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Illegal keyword encountered; is not a value [implements]

f = function f(x=implements=10){ }
                           ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._