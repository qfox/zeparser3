# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/assigns/keyword_with_escapes_check/arrow_second_char_escaped_x005bawait_x003dx003e_ax005cu0077aitx005d.md

> :: assigns : keyword with escapes check
>
> ::> arrow second char escaped [await => a\u0077ait]

## Input

`````js
(a\u0077ait, "sentinal 431431")
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
  loc:{start:{line:1,col:0},end:{line:1,col:31},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:31},source:''},
      expression: {
        type: 'SequenceExpression',
        loc:{start:{line:1,col:1},end:{line:1,col:30},source:''},
        expressions: [
          {
            type: 'Identifier',
            loc:{start:{line:1,col:1},end:{line:1,col:11},source:''},
            name: 'await'
          },
          {
            type: 'Literal',
            loc:{start:{line:1,col:13},end:{line:1,col:13},source:''},
            value: 'sentinal 431431',
            raw: '"sentinal 431431"'
          }
        ]
      }
    }
  ]
}

tokens (7x):
       PUNCTUATOR IDENT PUNCTUATOR STRING_DOUBLE PUNCTUATOR ASI
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

`````
throws: Parser error!
  Keywords may not have escapes in their name (canon=`await`, keyword=`a\u0077ait`

(a\u0077ait, "sentinal 431431")
           ^------- error
`````


### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._