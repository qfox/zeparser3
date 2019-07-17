# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/regexes/regular_expression_disambiguation/method_call_on_regex_literal/with_flag.md

> :: regexes : regular expression disambiguation : method call on regex literal
>
> ::> with flag

## Input

`````js
/foo/g.bar();
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
  loc:{start:{line:1,col:0},end:{line:1,col:13},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:13},source:''},
      expression: {
        type: 'CallExpression',
        loc:{start:{line:1,col:0},end:{line:1,col:12},source:''},
        callee: {
          type: 'MemberExpression',
          loc:{start:{line:1,col:0},end:{line:1,col:10},source:''},
          object: {
            type: 'Literal',
            loc:{start:{line:1,col:0},end:{line:1,col:6},source:''},
            value: null,
            regex: { pattern: 'foo', flags: 'g' },
            raw: '/foo/g'
          },
          property: {
            type: 'Identifier',
            loc:{start:{line:1,col:7},end:{line:1,col:7},source:''},
            name: 'bar'
          },
          computed: false
        },
        arguments: []
      }
    }
  ]
}

tokens (7x):
       REGEX PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
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