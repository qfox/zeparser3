# ZeParser parser test case

- Path: tests/testcases/for_statement/for-in/lhs_edge_cases/yield_no-arg_lhs_1.md

> :: for statement : for-in : lhs edge cases
>
> ::> yield no-arg lhs 1

## Input

`````js
for (yield in x);
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
  loc:{start:{line:1,column:0},end:{line:1,column:17},source:''},
  body: [
    {
      type: 'ForInStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:17},source:''},
      left: {
        type: 'Identifier',
        loc:{start:{line:1,column:5},end:{line:1,column:10},source:''},
        name: 'yield'
      },
      right: {
        type: 'Identifier',
        loc:{start:{line:1,column:14},end:{line:1,column:15},source:''},
        name: 'x'
      },
      body: {
        type: 'EmptyStatement',
        loc:{start:{line:1,column:16},end:{line:1,column:17},source:''}
      }
    }
  ]
}

tokens (8x):
       IDENT PUNCTUATOR IDENT IDENT IDENT PUNCTUATOR PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Cannot use `yield` outside of generator functions when in strict mode

for (yield in x);
           ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._