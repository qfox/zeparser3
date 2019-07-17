# ZeParser parser autogenerated test case

- From: zeparser3/tests/testcases/parser/strict_mode/header_requirements_for_directive_in_body/func_decl/autogen.md
- Path: zeparser3/tests/testcases/parser/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/arrow_as_param_name_w_directive

> :: test: arrow; as param name w directive
>
> :: case: protected

## Input


`````js
(protected) => {
  "use strict";
}
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Can only declare use strict if func params are "simple"

(protected) => {
  "use strict";
}
^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Illegal keyword encountered; is not a value [protected]

(protected) => {
          ^------- error

  "use strict";
}
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._