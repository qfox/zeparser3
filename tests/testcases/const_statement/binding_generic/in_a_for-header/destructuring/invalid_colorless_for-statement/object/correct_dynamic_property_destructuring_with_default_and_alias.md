# ZeParser parser test case

- Path: tests/testcases/const_statement/binding_generic/in_a_for-header/destructuring/invalid_colorless_for-statement/object/correct_dynamic_property_destructuring_with_default_and_alias.md

> :: const statement : binding generic : in a for-header : destructuring : invalid colorless for-statement : object
>
> ::> correct dynamic property destructuring with default and alias

## Input

`````js
for (const {[x]: y = z} = a);
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Next ord should be 59 (`;`) but was 41 (curc: `)`, token: `)`)

for (const {[x]: y = z} = a);
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