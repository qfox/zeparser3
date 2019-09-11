# ZeParser parser test case

- Path: tests/testcases/var_statement/binding_generic/in_export_decl/destructuring/array/rest_operator/rest_with_default.md

> :: var statement : binding generic : in export decl : destructuring : array : rest operator
>
> ::> rest with default
>
> rest cannot get a default in var decls but they can as func args

## Input


`````js
export var [...bar = foo] = obj;
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  The `export` keyword can only be used with the module goal

export var [...bar = foo] = obj;
^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

`````
throws: Parser error!
  The binding pattern is not destructible

export var [...bar = foo] = obj;
                          ^------- error
`````


### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._