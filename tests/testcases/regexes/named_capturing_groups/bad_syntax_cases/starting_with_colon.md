# ZeParser parser test case

- Path: tests/testcases/regexes/named_capturing_groups/bad_syntax_cases/starting_with_colon.md

> :: regexes : named capturing groups : bad syntax cases
>
> ::> starting with colon

## Input


`````js
/(?<:a>a)/
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Tokenizer error!
    Regex: Wanted to parse an unescaped group name specifier but it had a bad start: [`:`, 58]

/(?<:a>a)/
^------- error
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
ast: {
  type: 'Program',
  loc:{start:{line:1,column:0},end:{line:1,column:10},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:10},source:''},
      expression: {
        type: 'Literal',
        loc:{start:{line:1,column:0},end:{line:1,column:10},source:''},
        value: null,
        regex: { pattern: '(?<:a>a)', flags: '' },
        raw: '/(?<:a>a)/'
      }
    }
  ]
}

tokens (3x):
       REGEX ASI
`````
