# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/objects/duplicate_keys/obj_expr/dunderproto___proto__/without_webcompat/bad_case_with_wrapped_in_array.md

> :: objects : duplicate keys : obj expr : dunderproto __proto__ : without webcompat
>
> ::> bad case with wrapped in array

## Input

`````js
x = [{__proto__: 1, __proto__: 2}]
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
  loc:{start:{line:1,col:0},end:{line:1,col:34},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:34},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,col:0},end:{line:1,col:34},source:''},
        left: {
          type: 'Identifier',
          loc:{start:{line:1,col:0},end:{line:1,col:2},source:''},
          name: 'x'
        },
        operator: '=',
        right: {
          type: 'ArrayExpression',
          loc:{start:{line:1,col:4},end:{line:1,col:34},source:''},
          elements: [
            {
              type: 'ObjectExpression',
              loc:{start:{line:1,col:5},end:{line:1,col:33},source:''},
              properties: [
                {
                  type: 'Property',
                  loc:{start:{line:1,col:6},end:{line:1,col:18},source:''},
                  key: {
                    type: 'Identifier',
                    loc:{start:{line:1,col:6},end:{line:1,col:17},source:''},
                    name: '__proto__'
                  },
                  kind: 'init',
                  method: false,
                  computed: false,
                  value: {
                    type: 'Literal',
                    loc:{start:{line:1,col:17},end:{line:1,col:17},source:''},
                    value: 1,
                    raw: '1'
                  },
                  shorthand: false
                },
                {
                  type: 'Property',
                  loc:{start:{line:1,col:20},end:{line:1,col:32},source:''},
                  key: {
                    type: 'Identifier',
                    loc:{start:{line:1,col:20},end:{line:1,col:31},source:''},
                    name: '__proto__'
                  },
                  kind: 'init',
                  method: false,
                  computed: false,
                  value: {
                    type: 'Literal',
                    loc:{start:{line:1,col:31},end:{line:1,col:31},source:''},
                    value: 2,
                    raw: '2'
                  },
                  shorthand: false
                }
              ]
            }
          ]
        }
      }
    }
  ]
}

tokens (15x):
       IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
       NUMBER_DEC PUNCTUATOR IDENT PUNCTUATOR NUMBER_DEC PUNCTUATOR
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

`````
throws: Parser error!
  Found an object with double `__proto__` which is not allowed here in webcompat

x = [{__proto__: 1, __proto__: 2}]
                                 ^------- error
`````
