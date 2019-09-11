# ZeParser parser test case

- Path: tests/testcases/statements_and_declarations/cannot_nest_a_declaration_inside_a_non-block_statement/let/do.md

> :: statements and declarations : cannot nest a declaration inside a non-block statement : let
>
> ::> do

## Input


`````js
do let y = x; while (x);
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Unable to ASI, token: {# IDENT : nl=N ws=N pos=7:8 loc=7:1 curc=121 `y`#}

do let y = x; while (x);
       ^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  `let` declaration not allowed here and `let` cannot be a regular var or label name in strict mode

do let y = x; while (x);
       ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._