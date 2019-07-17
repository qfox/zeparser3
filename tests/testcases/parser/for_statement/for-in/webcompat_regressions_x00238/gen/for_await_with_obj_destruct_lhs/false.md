# ZeParser parser autogenerated test case

- From: zeparser3/tests/testcases/parser/for_statement/for-in/webcompat_regressions_x00238/autogen.md
- Path: zeparser3/tests/testcases/parser/for_statement/for-in/webcompat_regressions_x00238/gen/for_await_with_obj_destruct_lhs

> :: test: for await with obj destruct lhs
>
> :: case: false

## Input


`````js
async function f() { for await ({x} in y) {} }
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Can not use `for-await` with a `for-in`, only `for-of`

async function f() { for await ({x} in y) {} }
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

_Output same as sloppy mode._