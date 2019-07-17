# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/for_statement/for-in/let_as_a_var/let_is_allowed_as_the_lhs_to_for-in.md

> :: for statement : for-in : let as a var
>
> ::> let is allowed as the lhs to for-in
>
> for-in allows certain lhs that starts with `let`. In strict mode all bets are off.

## Input

`````js
for (let in x);
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
  loc:{start:{line:1,col:0},end:{line:1,col:15},source:''},
  body: [
    {
      type: 'ForInStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:15},source:''},
      left: {
        type: 'Identifier',
        loc:{start:{line:1,col:9},end:{line:1,col:9},source:''},
        name: 'in'
      },
      right: {
        type: 'Identifier',
        loc:{start:{line:1,col:12},end:{line:1,col:13},source:''},
        name: 'x'
      },
      body: {
        type: 'EmptyStatement',
        loc:{start:{line:1,col:14},end:{line:1,col:15},source:''}
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
  Let binding missing binding names as `let` cannot be a var name in strict mode

for (let in x);
         ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._