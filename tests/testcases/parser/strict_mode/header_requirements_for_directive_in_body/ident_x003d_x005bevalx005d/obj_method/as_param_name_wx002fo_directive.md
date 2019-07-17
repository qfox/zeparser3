# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bevalx005d/obj_method/as_param_name_wx002fo_directive.md

> :: strict mode : header requirements for directive in body : ident = [eval] : obj method
>
> ::> as param name w/o directive

## Input

`````js
o = {foo(eval){ }}
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
  loc:{start:{line:1,col:0},end:{line:1,col:18},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:18},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,col:0},end:{line:1,col:18},source:''},
        left: {
          type: 'Identifier',
          loc:{start:{line:1,col:0},end:{line:1,col:2},source:''},
          name: 'o'
        },
        operator: '=',
        right: {
          type: 'ObjectExpression',
          loc:{start:{line:1,col:4},end:{line:1,col:18},source:''},
          properties: [
            {
              type: 'Property',
              loc:{start:{line:1,col:5},end:{line:1,col:17},source:''},
              key: {
                type: 'Identifier',
                loc:{start:{line:1,col:5},end:{line:1,col:8},source:''},
                name: 'foo'
              },
              kind: 'init',
              method: true,
              computed: false,
              value: {
                type: 'FunctionExpression',
                loc:{start:{line:1,col:5},end:{line:1,col:17},source:''},
                generator: false,
                async: false,
                id: null,
                params: [
                  {
                    type: 'Identifier',
                    loc:{start:{line:1,col:9},end:{line:1,col:9},source:''},
                    name: 'eval'
                  }
                ],
                body: {
                  type: 'BlockStatement',
                  loc:{start:{line:1,col:14},end:{line:1,col:17},source:''},
                  body: []
                }
              },
              shorthand: false
            }
          ]
        }
      }
    }
  ]
}

tokens (12x):
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR PUNCTUATOR PUNCTUATOR ASI
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Cannot use this name (eval) as a variable name because: Cannot create a binding named `eval` in strict mode

o = {foo(eval){ }}
         ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._