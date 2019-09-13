import babel from '@babel/parser';
import {
  ASSERT,
  astToString,
  encodeUnicode,
  normalizeAst,
  PROJECT_ROOT_DIR,
} from "./utils.mjs";
import {execSync} from 'child_process';
import {COLLECT_TOKENS_SOLID, GOAL_MODULE, GOAL_SCRIPT} from "../src/zetokenizer.mjs";
import ZeParser from '../src/zeparser.mjs';

const TEST_SLOPPY = 'sloppy';
const TEST_STRICT = 'strict';
const TEST_MODULE = 'module';
const TEST_WEB = 'web';

function testBabel(code, mode) {
  if (mode === 'strict' || mode === 'sloppy') return false;
  // The Babel parser seems to apply AnnexB by default with no opt-out so we can't test strict/sloppy directly
  return babel.parse(code, {
    sourceType: mode === 'module' ? 'module' : 'script',
    // https://babeljs.io/docs/en/babel-parser
    // It explicitly mentions a strictMode option, but when running it this fails :(
    // strictMode: mode === 'strict',
    plugins: ['dynamicImport'],
  });
}

function compareBabel(code, zeparserPassed, testVariant, file) {
  let babelOk, babelFail, zasb;
  try {
    babelOk = testBabel(code, testVariant);
  } catch (e) {
    babelFail = e;
  }

  if (zeparserPassed && babelOk) {
    try {
      zasb = ZeParser(
        code,
        testVariant === TEST_MODULE ? GOAL_MODULE : GOAL_SCRIPT,
        COLLECT_TOKENS_SOLID,
        {
          strictMode: testVariant === TEST_STRICT,
          webCompat: testVariant === TEST_WEB,
          babelCompat: true,

          $log: () => {},
          $warn: () => {},
          $error: () => {},
        },
      );
    } catch (e) {
      ASSERT(false, 'file: ' + file + '; the output pass/fail with and without babelCompat should be the same and the run without babelCompat passed, so this should pass too', e);
    }
  }

  return [babelOk, babelFail, zasb];
}

function babelScrub(ast) {
  return (
    astToString(
      JSON.parse(
        JSON.stringify(
          ast, null, 2
        )
      )
    )
  );
}

function processBabelResult(babelOk, babelFail, zeparserFail, zasb, INPUT_OVERRIDE) {
  let outputBabel = '';
  if (babelOk && !zeparserFail) {
    let b = babelScrub(normalizeAst(babelOk.program, 'program'));
    let z = astToString(normalizeAst(zasb.ast, 'program'));
    if (b === z) {
      // outputBabel += '\nBabel: same';
    } else {
      let d = execSync(
        // Use sub-shell `<(...)` to prevent temporary file management.
        // Use base64 to prevent shell interpretation of input.
        // Final `true` is to suppress `diff`'s non-zero exit code when input differs.
        `diff -U 0 --text -d --suppress-blank-empty --ignore-blank-lines --ignore-all-space <(
            echo '${Buffer.from(encodeUnicode(z)).toString('base64')}' | base64 -d -
          ) <(
            echo '${Buffer.from(encodeUnicode(b)).toString('base64')}' | base64 -d -
          ) || true`
        , {shell: '/bin/bash', encoding: 'utf8'}
      ).replace(/^(?:\+\+\+ \/|--- \/|@@ ).*$/gm, '').replace(/\n+/g, '\n');

      outputBabel += '\nBabel AST is different:\n' + d;
      if (INPUT_OVERRIDE) console.log('=>', outputBabel);
    }
  } else if (!babelFail && zeparserFail) {
    // outputBabel += '\nBabel did not throw an error\n' + [babelOk, babelFail];
  } else if (babelFail && !zeparserFail) {
    outputBabel += '\nBabel threw an error (and zeparser did not): ' + babelFail + '\n';
    if (INPUT_OVERRIDE) console.log('=>', babelFail);
  } else {
    // outputBabel = '\n(Babel did not run)\n';
  }

  return outputBabel;
}

function ignoreZeparserTestForBabel(file) {
  // There are some files where I've asserted that the AST mismatch between Babel and ZeParser is caused by something
  // either I won't fix, Babel does wrong, or a difference that is benign enough not to matter to me.

  return [
    // Double paren wrapped delete arg; babel uses outer-most paren for location, zeparser uses inner-most
    // (Neither is wrong, inner is just easier for us)
    'tests/testcases/assigns/assign_to_double_wrapped_group.md',
    'tests/testcases/assigns/assign_with_dud_group.md',
    'tests/testcases/assigns/destruct_assignment_to_noop-groups_ident.md',
    'tests/testcases/assigns/double_wrapped_group_in_the_middle.md',
    'tests/testcases/delete/for_header_ternary_flag.md',
    'tests/testcases/delete/single_ident_cases/multi_wrap_property.md',
    'tests/testcases/delete/single_ident_cases/wrapped_arrow_wrapped_prop.md',
    'tests/testcases/delete/single_ident_cases/wrapped_assign_outer_prop.md',
    'tests/testcases/destructuring/destructuring_assignments_of_groups/noop_parens/many_paren_base_case.md',
    'tests/testcases/destructuring/destructuring_assignments_of_groups/noop_parens/many_paren_properties_are_simple_assignments.md',

    // Bug in babel; regex on new line after typeof statement
    //     https://github.com/babel/babel/issues/10410
    'tests/testcases/functions/expression/regex_edge_case/with_async/expression/with_flag.md',

    // Bug in babel; incorrect use strict assignments to arguments/eval
    //    https://github.com/babel/babel/issues/10411
    'tests/testcases/objects/destructuring/identifier_properties/keyword_obj_key_check/gen/shorthand/arguments.md',
    'tests/testcases/objects/destructuring/identifier_properties/keyword_obj_key_check/gen/shorthand/eval.md',
    'tests/testcases/objects/literals/arguments_as_shorthand_keys.md',
    'tests/testcases/objects/literals/cannot_use_as_shorthand_objlit_x005bargumentsx005d.md',
    'tests/testcases/objects/literals/cannot_use_as_shorthand_objlit_x005bevalx005d.md',
    'tests/testcases/objects/literals/eval_as_shorthand_keys.md',
    'tests/testcases/objects/literals/keywords_in_object_shorthand/gen/cannot_use_as_shorthand_objlit/arguments.md',
    'tests/testcases/objects/literals/keywords_in_object_shorthand/gen/cannot_use_as_shorthand_objlit/eval.md',
    // same but because Babel doesn't pick up the assignment destructuring to a _property_ on the obj with shorthand
    'tests/testcases/random_stuff/x002318/ax002f0.md',
    'tests/testcases/random_stuff/x002318/gen/ax002f_case/x0028x007bx002ex002ex002ex007bevalx007dx002exx007d_x003d_x007bx007dx0029_.md',
    // same but because Babel doesn't notice the property access on the next line
    //    https://github.com/babel/babel/issues/10412
    'tests/testcases/strict_mode/asi/tails_that_prevent_ASI_so_it_is_not_a_directive_x00280x0029.md',
    'tests/testcases/strict_mode/asi/tails_that_prevent_ASI_so_it_is_not_a_directive_x00281x0029.md',
    'tests/testcases/strict_mode/asi/tails_that_prevent_ASI_so_it_is_not_a_directive_x00282x0029.md',
    'tests/testcases/strict_mode/asi/tails_that_prevent_ASI_so_it_is_not_a_directive_x00283x0029.md',
    'tests/testcases/strict_mode/asi/tails_that_prevent_ASI_so_it_is_not_a_directive_x00284x0029.md',
    'tests/testcases/strict_mode/asi/tails_that_prevent_ASI_so_it_is_not_a_directive_x00285x0029.md',
    'tests/testcases/strict_mode/asi/tails_that_prevent_ASI_so_it_is_not_a_directive_x00286x0029.md',

    // Comments, ugh
    'tests/testcases/directive_prologues/default_expression_statement_behavior/global/multi_directive_with_multi_comment_causing_asi.md',
    'tests/testcases/directive_prologues/default_expression_statement_behavior/global/multi_directive_with_multi_comment_sans_asi.md',
    'tests/testcases/directive_prologues/default_expression_statement_behavior/global/multi_directive_with_single_comment.md',
    'tests/testcases/directive_prologues/default_expression_statement_behavior/regular_function/multi_directive_with_multi_comment_causing_asi.md',
    'tests/testcases/directive_prologues/default_expression_statement_behavior/regular_function/multi_directive_with_multi_comment_sans_asi.md',
    'tests/testcases/directive_prologues/default_expression_statement_behavior/regular_function/multi_directive_with_single_comment.md',
    "tests/testcases/directive_prologues/into_Directive_node/global/multi_directive_with_multi_comment_causing_asi.md",
    "tests/testcases/directive_prologues/into_Directive_node/global/multi_directive_with_multi_comment_sans_asi.md",
    "tests/testcases/directive_prologues/into_Directive_node/global/multi_directive_with_single_comment.md",
    "tests/testcases/directive_prologues/into_Directive_node/regular_function/multi_directive_with_multi_comment_causing_asi.md",
    "tests/testcases/directive_prologues/into_Directive_node/regular_function/multi_directive_with_multi_comment_sans_asi.md",
    "tests/testcases/directive_prologues/into_Directive_node/regular_function/multi_directive_with_single_comment.md",
    "tests/testcases/var_statement/html_comment_close_marks_start_of_single_line_comment.md",
    'tests/testcases/whitespace/html_comments/html_close_comment_should_cause_asi.md',
    'tests/testcases/whitespace/html_comments/html_open_actually_has_no_close.md',
    'tests/testcases/whitespace/html_comments/html_open_on_its_own_line.md',
    'tests/testcases/whitespace/html_comments/html_open_without_close_1.md',
    'tests/testcases/whitespace/html_comments/html_open_without_close_2.md',
    'tests/testcases/whitespace/html_comments/same_test_with_newline.md',

    // Bug in Babel is generating invalid location
    //    https://github.com/babel/babel/issues/10435
    'tests/testcases/string/2028_is_ok.md',
    'tests/testcases/string/2029_is_ok.md',

    // This is just a weird sloppy/strict thing in Babel. Meh
    //    https://github.com/babel/babel/issues/10413
    'tests/testcases/var_statement/binding_generic/reserved_words/gen/catch_clause/let.md',

    // Babel applies annexB by default. The __proto__ is annexB but allowed in strict. so module output crashes.
    'tests/testcases/for_statement/for-loop/double_proto/double_proto_of_lhs_arr_in_web_compat.md',
    'tests/testcases/for_statement/for-loop/double_proto/double_proto_of_lhs_arr_no_web_compat.md',
    'tests/testcases/for_statement/for-loop/double_proto/double_proto_of_lhs_obj_in_web_compat.md',
    'tests/testcases/for_statement/for-loop/double_proto/double_proto_of_lhs_obj_no_web_compat.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/arr_paren_wrapped_is_explicitly_exempted.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/arrow_is_explicitly_exempted.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/async_arrow_is_explicitly_exempted.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/async_call_wrapped_is_explicitly_exempted.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/bad_case_with_ident_and_string.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/bad_case_with_string_and_ident.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/bad_case_with_strings.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/bad_case_with_two_idents.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/bad_case_with_wrapped_in_array.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/bad_case_wrapped_in_array.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/not_async/arr_plain_group.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/not_async/as_an_arrow.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/not_async/destructuring_assignment.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/not_async/grouped_destructuring_assignment.md',
    // I think this is a different error because this is an actual error
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/not_async/inside_a_complex_destruct_in_an_arrow_1.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/not_async/obj_plain_group.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/not_async/plain_group.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/with_async/as_an_arrow.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/with_async/grouped_destructuring_assignment.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/with_async/plain_group.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/obj_paren_wrapped_is_explicitly_exempted.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/paren_wrapped.md',

    // Bug: I think this is a bug in test262 that was copied as fact by Babel (proto in grouped object should be ignored as potential pattern in arrow)
    //    https://github.com/tc39/test262/issues/2344
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/ident_string.md',

    // To investigate: These only occur in the async version of the test. Babel applying non-annexb rules to lexical bindings
    'tests/testcases/functions/declaration/block_scoped/gen/catch_block/async_function_fx0028x0029x007bx007d.md',
    'tests/testcases/functions/declaration/block_scoped/gen/catch_block/async_function_x002afx0028x0029x007bx007d.md',
    'tests/testcases/functions/declaration/block_scoped/gen/catch_block/function_x002afx0028x0029x007bx007d.md',
    'tests/testcases/functions/declaration/block_scoped/gen/finally_block/async_function_fx0028x0029x007bx007d.md',
    'tests/testcases/functions/declaration/block_scoped/gen/finally_block/async_function_x002afx0028x0029x007bx007d.md',
    'tests/testcases/functions/declaration/block_scoped/gen/finally_block/function_x002afx0028x0029x007bx007d.md',
    'tests/testcases/functions/declaration/block_scoped/gen/func_func/async_function_fx0028x0029x007bx007d.md',
    'tests/testcases/functions/declaration/block_scoped/gen/func_func/async_function_x002afx0028x0029x007bx007d.md',
    'tests/testcases/functions/declaration/block_scoped/gen/func_func/function_x002afx0028x0029x007bx007d.md',
    'tests/testcases/functions/declaration/block_scoped/gen/switch_case_block/async_function_fx0028x0029x007bx007d.md',
    'tests/testcases/functions/declaration/block_scoped/gen/switch_case_block/async_function_x002afx0028x0029x007bx007d.md',
    'tests/testcases/functions/declaration/block_scoped/gen/switch_case_block/function_x002afx0028x0029x007bx007d.md',
    'tests/testcases/functions/declaration/block_scoped/gen/switch_default_block/async_function_fx0028x0029x007bx007d.md',
    'tests/testcases/functions/declaration/block_scoped/gen/switch_default_block/async_function_x002afx0028x0029x007bx007d.md',
    'tests/testcases/functions/declaration/block_scoped/gen/switch_default_block/function_x002afx0028x0029x007bx007d.md',

    // To investigate: range difference in html comment
    'tests/testcases/random_stuff/x002318/bx002f1.md',
    'tests/testcases/random_stuff/x002318/gen/ax002f_case/x002fx002ax002ax002f_--x003e_comment.md',
    'tests/testcases/whitespace/html_comments/html_close_comment_can_have_multiline_comment_on_a_multiple_lines_before_it.md',
    'tests/testcases/whitespace/html_comments/html_close_comment_can_have_multiline_comment_on_a_single_line_before_it_without_needing_a_newline.md',
    'tests/testcases/whitespace/html_comments/html_close_comment_can_have_multiple_multiline_comment_on_a_single_line_before_it.md',

    // Location bug in grouped sequence
    //    https://github.com/babel/babel/issues/10436
    'tests/testcases/classes/extending/multi-line.md',
    'tests/testcases/group_or_arrow/group/multi_line_location.md',
    'tests/testcases/comma/toplevel_statement_expression/multiline.md',

    // Location of 2028/2029
    //    https://github.com/babel/babel/issues/10435
    'tests/testcases/string/2028_is_ok.md',
    'tests/testcases/string/2029_is_ok.md',
    'tests/testcases/tagged_templates/escapes/2028.md',
    'tests/testcases/tagged_templates/escapes/2029.md',
    'tests/testcases/templates/escapes/2028.md',
    'tests/testcases/templates/escapes/2029.md',
    'tests/testcases/string/escapes/2028.md',
    'tests/testcases/string/escapes/2029.md',
    'tests/testcases/string/location_2028.md',
    'tests/testcases/string/location_2029.md',

    // Bug: the .value for the tagged template is not null even though the \8 and \9 are always bad escapes for templates
    //    https://github.com/babel/babel/issues/10437
    'tests/testcases/tagged_templates/escapes/octal/escape_8.md',
    'tests/testcases/tagged_templates/escapes/octal/escape_9.md',

  ].includes(file.slice(PROJECT_ROOT_DIR.length + 1));
}

function ignoreTest262Babel(file) {
  // Comment nodes should be stripped from inputs
  return [
    // These tests multiline comment with newline. Stripping comments for Babel causes a syntax error. So just skip it.
    'test262/test/language/comments/multi-line-asi-carriage-return.js',
    'test262/test/language/comments/multi-line-asi-line-separator.js',
    'test262/test/language/comments/multi-line-asi-paragraph-separator.js',

    // Bug in Babel (I guess? Or wrong config ..?)
    'test262/test/language/expressions/assignment/destructuring/obj-prop-__proto__dup.js',

    // I'm not sure why Babel throws here (why would it ever consider that part to be a block? Why else throw?)
    //     https://github.com/babel/babel/issues/10438
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-break-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-case-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-catch-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-class-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-const-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-continue-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-debugger-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-default-escaped-ext.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-default-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-delete-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-do-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-else-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-export-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-extends-escaped-ext.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-extends-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-finally-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-for-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-function-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-if-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-import-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-in-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-instanceof-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-new-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-return-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-super-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-switch-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-this-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-throw-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-try-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-typeof-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-var-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-void-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-while-escaped.js',
    'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-with-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-break-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-case-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-catch-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-class-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-const-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-continue-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-debugger-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-default-escaped-ext.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-default-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-delete-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-do-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-else-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-export-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-extends-escaped-ext.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-extends-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-finally-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-for-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-function-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-if-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-import-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-in-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-instanceof-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-new-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-return-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-super-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-switch-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-this-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-throw-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-try-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-typeof-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-var-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-void-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-while-escaped.js',
    'test262/test/language/expressions/assignment/member-expr-ident-name-with-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-break-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-case-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-catch-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-class-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-const-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-continue-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-debugger-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-default-escaped-ext.js',
    'test262/test/language/expressions/class/ident-name-method-def-default-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-delete-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-do-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-else-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-export-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-extends-escaped-ext.js',
    'test262/test/language/expressions/class/ident-name-method-def-extends-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-finally-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-for-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-function-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-if-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-import-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-in-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-instanceof-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-new-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-return-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-super-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-switch-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-this-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-throw-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-try-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-typeof-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-var-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-void-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-while-escaped.js',
    'test262/test/language/expressions/class/ident-name-method-def-with-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-break-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-case-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-catch-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-class-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-const-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-continue-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-debugger-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-default-escaped-ext.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-default-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-delete-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-do-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-else-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-export-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-extends-escaped-ext.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-extends-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-finally-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-for-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-function-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-if-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-import-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-in-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-instanceof-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-new-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-return-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-super-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-switch-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-this-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-throw-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-try-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-typeof-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-var-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-void-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-while-escaped.js',
    'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-with-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-break-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-case-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-catch-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-class-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-const-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-continue-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-debugger-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-default-escaped-ext.js',
    'test262/test/language/expressions/object/ident-name-method-def-default-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-delete-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-do-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-else-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-export-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-extends-escaped-ext.js',
    'test262/test/language/expressions/object/ident-name-method-def-extends-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-finally-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-for-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-function-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-if-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-import-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-in-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-instanceof-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-new-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-return-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-super-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-switch-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-this-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-throw-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-try-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-typeof-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-var-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-void-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-while-escaped.js',
    'test262/test/language/expressions/object/ident-name-method-def-with-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-break-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-case-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-catch-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-class-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-const-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-continue-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-debugger-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-default-escaped-ext.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-default-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-delete-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-do-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-else-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-export-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-extends-escaped-ext.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-extends-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-finally-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-for-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-function-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-if-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-import-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-in-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-instanceof-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-new-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-return-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-super-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-switch-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-this-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-throw-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-try-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-typeof-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-var-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-void-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-while-escaped.js',
    'test262/test/language/expressions/object/ident-name-prop-name-literal-with-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-break-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-case-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-catch-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-class-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-const-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-continue-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-debugger-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-default-escaped-ext.js',
    'test262/test/language/statements/class/ident-name-method-def-default-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-delete-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-do-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-else-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-export-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-extends-escaped-ext.js',
    'test262/test/language/statements/class/ident-name-method-def-extends-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-finally-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-for-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-function-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-if-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-import-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-in-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-instanceof-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-new-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-return-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-super-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-switch-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-this-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-throw-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-try-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-typeof-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-var-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-void-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-while-escaped.js',
    'test262/test/language/statements/class/ident-name-method-def-with-escaped.js',

    // Grouped sequence expression has incorrect range end
    //    https://github.com/babel/babel/issues/10436
    'test262/test/language/expressions/class/scope-name-lex-open-heritage.js',
    'test262/test/language/expressions/function/scope-name-var-open-non-strict.js',
    'test262/test/language/expressions/generators/scope-name-var-open-non-strict.js',
    'test262/test/language/statements/class/scope-name-lex-open-heritage.js',

    // Should PS/LS increment the location line? Pending https://github.com/estree/estree/issues/199
    //    https://github.com/babel/babel/issues/10435
    'test262/test/language/expressions/template-literal/tv-line-continuation.js',
    'test262/test/language/expressions/template-literal/tv-line-terminator-sequence.js',
    'test262/test/language/literals/string/line-continuation-double.js',
    'test262/test/language/literals/string/line-continuation-single.js',
    'test262/test/language/literals/string/line-separator.js',
    'test262/test/language/literals/string/paragraph-separator.js',
  ].includes(file.slice(file.indexOf('/test262/') + 1));
}

export {
  babelScrub,
  compareBabel,
  ignoreTest262Babel,
  ignoreZeparserTestForBabel,
  processBabelResult,
  testBabel,
};
