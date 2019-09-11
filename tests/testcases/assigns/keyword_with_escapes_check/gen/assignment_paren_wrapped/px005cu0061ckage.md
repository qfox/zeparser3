# ZeParser parser autogenerated test case

- From: tests/testcases/assigns/keyword_with_escapes_check/autogen.md
- Path: tests/testcases/assigns/keyword_with_escapes_check/gen/assignment_paren_wrapped/px005cu0061ckage.md

> :: assigns : keyword with escapes check : gen : assignment paren wrapped
>
> ::> px005cu0061ckage

## Input


`````js
(p\u0061ckage = x);
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
  loc:{start:{line:1,column:0},end:{line:1,column:19},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:19},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,column:1},end:{line:1,column:17},source:''},
        left: {
          type: 'Identifier',
          loc:{start:{line:1,column:1},end:{line:1,column:13},source:''},
          name: 'package'
        },
        operator: '=',
        right: {
          type: 'Identifier',
          loc:{start:{line:1,column:16},end:{line:1,column:17},source:''},
          name: 'x'
        }
      }
    }
  ]
}

tokens (7x):
       PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Keywords may not have escapes in their name (canon=`package`, keyword=`p\u0061ckage`

(p\u0061ckage = x);
              ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._