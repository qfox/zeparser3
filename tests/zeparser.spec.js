#!/usr/bin/env node

// use https://astexplorer.net/ for ast comparisons

Error.stackTraceLimit = Infinity; // TODO: cut off at node boundary...

const TEST262 = process.argv.includes('-t') || (process.argv.includes('-T') ? false : false);
const SKIP_TO = TEST262 ? 0 : 0; // skips the first n tests (saves me time)
const STOP_AFTER_FAIL = process.argv.includes('-f') || (process.argv.includes('-F') ? false : true);

let fs = require('fs');
let Prettier = (function(){ try { return require('prettier'); } catch (e) {
  // ignore if not installed
  console.log('Prettier not found. Run `yarn add prettier` or `npm install prettier` if you want to run Prettier on the AST output');
}})();

let {parse: babelParse} = process.argv.includes('-b') ? (() => {try { return require('@babel/parser'); } catch (e) {
  // ignore if not installed
  console.log('Babel parser not found. Run `yarn add @babel/parser` or `npm install @babel/parser` if you want to run with `-b` (tests against Babel)');
}})() : {};

let {
  MODE_MODULE,
  MODE_SCRIPT,

  toPrint,
} = require('./utils.js');
let {
  default: ZeParser,
  COLLECT_TOKENS_NONE,
  COLLECT_TOKENS_SOLID,
  COLLECT_TOKENS_ALL,

  GOAL_MODULE,
  GOAL_SCRIPT,
} = require('../src/zeparser'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)

let ZeParserBuild = require('../build/build.js').default;

let {
  $EOF,

  debug_toktype,
} = require('../src/zetokenizer'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)

const BOLD = '\033[;1;1m';
const BLINK = '\033[;5;1m';
const RED = '\033[31m';
const GREEN = '\033[32m';
const RESET = '\033[0m';

let dir = __dirname + '/testcases/parser';
let files = [];
function read(path, file) {
  let combo = path + file;
  //console.log([path, file], combo)
  console.log('read:', path + file);
  if (fs.statSync(combo).isFile()) {
    let before = files.length;
    files.push(combo);
  } else {
    fs.readdirSync(combo + '/').forEach(s => read(combo + '/', s));
  }
}
read(dir, '');

files = files.filter(f => f.indexOf('test262') >= 0 === TEST262);

files.sort((a, b) => {
  // push test262 to the back so our own unit tests can find problems first
  if (a.indexOf('test262') >= 0) return 1;
  if (b.indexOf('test262') >= 0) return -1;
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
});
//console.log(files);

let cases = [];
let descStack = [];
files.map(path => {
  let moduleExports = require(path);
  let before = cases.length;
  function describe(desc, callback) {
    descStack.push(desc);
    callback();
    descStack.pop();
  }
  function test(desc, obj) {
    return cases.push({desc: descStack.join(' \u2B9E ') + ' \u2B8A ' + BOLD + desc + RESET + ' \u2B88', from: path, obj});
  }
  test.pass = (desc, obj) => test(desc, {ast: true, tokens: true, ...obj});
  test.fail = (desc, obj) => test(desc, {throws: true, ...obj});
  test.fail_strict = (desc, obj) => test(desc, {throws: true, SLOPPY_SCRIPT:{ast:true,tokens:true}, ...obj});
  moduleExports(
    describe,
    test,
  );
  console.log('Added', cases.length-before,' tests from', path);
});

let checkAST = true;
let parserDesc = '';
function all(parser, tests) {
  for (let {desc, from, obj: test} of tests) {
    one(parser, test, desc, from);
  }
}
function one(parser, testObj, desc, from) {
  let {code} = testObj;
  ++testi;
  if (_one(parser, '   ', code, testObj, desc, from)) {
    _one(parser, '[a]', '\n' + code, testObj, desc, from);
    _one(parser, '[b]', code + '\n', testObj, desc, from);
    _one(parser, '[c]', ' ' + code, testObj, desc, from);
    _one(parser, '[d]', code + ' ', testObj, desc, from);
  }
}
function _one(Parser, testSuffix, code, testObj, desc, from) {
  // shorthand for just goal_script/sloppy settings (prevents unncessary object wrapping *shrug*)
  if (testObj.WEB && testObj.WEB !== true) {
    if (testObj.SLOPPY_SCRIPT !== undefined) throw new Error('SLOPPY_SCRIPT should not be set if WEB is set');
    // TODO: run sloppy mode tests with and without the web compat flag instead of targeting them explicitly
    testObj.SLOPPY_SCRIPT = testObj.WEB;
    testObj.WEB = true;
  }
  let sloppyScriptOptions = testObj.SLOPPY_SCRIPT;
  if (sloppyScriptOptions) {
    if (testObj.SLOPPY !== undefined) throw new Error('SLOPPY and SLOPPY_SCRIPT should not both be set');
    if (testObj.SCRIPT !== undefined) throw new Error('SCRIPT and SLOPPY_SCRIPT should not both be set');
    delete testObj.SLOPPY_SCRIPT;
    testObj.SLOPPY = {SCRIPT: sloppyScriptOptions};
  }

  // test both module and script parsing modes. if a test should have different outcomes between them then it should use
  [MODE_SCRIPT, MODE_MODULE].forEach(goal => {
    // similarly, run all tests in both sloppy and strict mode. use STRICT and SLOPPY to add exceptions.
    let ms = '[' + (goal === MODE_SCRIPT ? 'Script' : 'Module') + ']';
    // goal + strict test
    if (goal === MODE_MODULE) {
      // the MODULE_MODE and SCRIPT_MODE properties to override the expectations.
      let totalTestOptions = override(testObj.STRICT, Object.assign({startInStrictMode: true}, testObj));
      // dont run sloppy tests in module goal since that's an impossible situation (old tests still use this flag)
      // TODO: replace startInStrictMode with expectations of sloppy mode
      if (totalTestOptions.startInStrictMode) {
        if (!testObj.STRICT || !testObj.STRICT.SKIP) {
          __one(Parser, testSuffix + ms, code, goal, totalTestOptions, desc, from);
        }
      }
    }
    // goal + sloppy test
    // module mode is ALWAYS strict mode so skip sloppy
    if (goal === MODE_SCRIPT && (!testObj.SLOPPY || !testObj.SLOPPY.SKIP)) {
      let totalTestOptions = override(testObj.SLOPPY, Object.assign({startInStrictMode: false}, testObj));
      // dont run sloppy tests in module goal since that's an impossible situation (old tests still use this flag)
      // TODO: replace startInStrictMode with expectations of sloppy mode
      if (!totalTestOptions.startInStrictMode) {
        __one(Parser, testSuffix + ms, code, goal, totalTestOptions, desc, from);
      }
    }
  });
}
function override(wantObj, baseObj) {
  if (wantObj) {
    Object.assign(baseObj, wantObj);
    // must cleanup if ast/throws is used from wantObj
    if (wantObj.ast) delete baseObj.throws;
    if (wantObj.throws) delete baseObj.ast;
  }
  return baseObj;
}
function __one(Parser, testSuffix, code = '', mode, testDetails, desc, from) {
  if (testi < SKIP_TO) return;
  let {
    ast: expectedAst,
    callback: expectedCallback,
    SCRIPT: scriptModeObj,
    MODULE: moduleModeObj,
    throws: expectedThrows,
    tokens: expectedTokens,
    startInStrictMode,
    debug: _debug,
    SKIP,
    WEB,
    ES,
    OPTIONS,
  } = testDetails;

  ++testj;

  //if (testj !== 3319) return;
  testSuffix += '[' + (startInStrictMode ? 'Strict' : 'Sloppy') + ']';
  testSuffix += '[' + testj + ']';
  if (WEB) testSuffix += '[' + BLINK + 'WEB' + BOLD + ']';
  if (ES) testSuffix += '[' + BLINK + 'ES' + ES + BOLD + ']';
  if (OPTIONS) testSuffix += '[' + BLINK + 'OPTIONS=' + JSON.stringify(OPTIONS) + BOLD + ']';

  // goal specific overrides
  // (throws override ast and ast overrides throws)
  let brake = testDetails.brake;
  if (mode === MODE_SCRIPT && scriptModeObj) {
    if (scriptModeObj.STRICT || scriptModeObj.SLOPPY) throw new Error('Bad test: Put STRICT/SLOPPY before MODULE mode');
    if (scriptModeObj.throws) {
      expectedAst = undefined;
      expectedThrows = scriptModeObj.throws;
    }
    if (scriptModeObj && 'brake' in scriptModeObj) brake = scriptModeObj.brake;
    if (scriptModeObj.SKIP !== undefined) SKIP = scriptModeObj.SKIP;
    if (scriptModeObj.ast) {
      expectedThrows = undefined;
      expectedAst = scriptModeObj.ast;
    }
    if (scriptModeObj.tokens) expectedTokens = scriptModeObj.tokens;
    if (scriptModeObj.startInStrictMode !== undefined) startInStrictMode = scriptModeObj.startInStrictMode;
  }
  if (mode === MODE_MODULE && moduleModeObj) {
    if (moduleModeObj.SKIP !== undefined) SKIP = moduleModeObj.SKIP;
    if (moduleModeObj.STRICT || moduleModeObj.SLOPPY) throw new Error('Bad test: Put STRICT/SLOPPY before MODULE mode');
    if (moduleModeObj.throws) {
      expectedAst = undefined;
      expectedThrows = moduleModeObj.throws;
    }
    if (moduleModeObj && 'brake' in moduleModeObj) brake = moduleModeObj.brake;
    if (moduleModeObj.ast) {
      expectedThrows = undefined;
      expectedAst = moduleModeObj.ast;
    }
    if (moduleModeObj.tokens) expectedTokens = moduleModeObj.tokens;
    if (moduleModeObj.startInStrictMode !== undefined) startInStrictMode = moduleModeObj.startInStrictMode;
  }

  // https://stackoverflow.com/questions/4842424/list-of-ansi-color-escape-sequences
  let prefix = BOLD + parserDesc + ': ' + testi + testSuffix;
  let suffix = RESET;

  if (mode === MODE_MODULE && !startInStrictMode) {
    throw new Error('Should not test module goal in sloppy mode because that is impossible anyways; ' + SKIP);
  }

  if (SKIP) {
    console.log(`${prefix} SKIP: \`${toPrint(code)}\`${suffix}`);
    ++skips;
    if (brake) throw BOLD + RED + 'stopped for test';
    return;
  }

  // pass references so we can report partial state in case of a crash
  var ast = {};
  var path = [];
  var tokens = [];

  let goalMode = mode === MODE_MODULE ? GOAL_MODULE : mode === MODE_SCRIPT ? GOAL_SCRIPT : MODE_VALUE_ERROR;
  let wasError = '';
  let stack;
  let tokenizer;
  let astPath;
  try {
    var obj = Parser(code, goalMode, COLLECT_TOKENS_SOLID, {
      strictMode: startInStrictMode,
      webCompat: !!WEB,
      trailingArgComma: testDetails.options && testDetails.options.trailingArgComma,
      astRoot: ast,
      tokenStorage: tokens,
      getTokenizer: tok => tokenizer = tok,
      targetEsVersion: ES || Infinity,
      ...OPTIONS,
    });
  } catch (f) {
    wasError = f.message;
    var obj = '' + f.stack;
    stack = f.stack;
  }

  astPath = ast.pathNames;
  delete ast.path; // meh
  delete ast.pathNames;

  if (!expectedTokens) {
    expectedTokens = ['<not given>'];
  }
  if (!expectedAst) {
    expectedAst = {'<not given>': true};
  }

  if (wasError) {
    let wasTodo = wasError.indexOf('TODO') >= 0;
    if (wasError.indexOf('Parser error!') < 0 && wasError.indexOf('Tokenizer error!') < 0 && !wasTodo) {
      console.log(`${RED}####  ${BLINK}CRASHED HARD${RESET}${RED}  ####${RESET}`);
      LOG_THROW('unexpected CRASH', code, stack, desc);
      console.log(`${RED}####  ${BLINK}CRASHED HARD${RESET}${RED}  ####${RESET}`);
      console.log('Thrown error:', wasError);
      ++fail;
      ++crash;
    } else if (!expectedThrows) {
      LOG_THROW(`${BOLD}unexpected ${RED}${wasTodo?'TODO':'ERROR'}${RESET}`, code, stack, desc);
      console.log('Thrown error:', wasError);
      ++fail;
      ++crash;
    } else if (wasError.indexOf('Parser error') !== 0 && wasError.indexOf('Tokenizer error') !== 0) {
      if (wasTodo) {
        LOG_THROW('TODO', code, stack, desc);
      } else {
        LOG_THROW('Unhandled exception path', code, stack, desc);
        console.log('Thrown error:', wasError);
      }
      ++fail;
      ++crash;
    } else if (!wasTodo && (expectedThrows === true || wasError.toUpperCase().indexOf(expectedThrows.toUpperCase()) >= 0)) {
      console.log(`${prefix} ${GREEN}PASS${RESET}: \`${toPrint(code)}\` :: (properly throws)${suffix}`);
      ++pass;
    } else {
      LOG_THROW('thrown message mismatch', code, stack, desc);
      console.log('Thrown error:', wasError);
      console.log('Expected error message to contain: "' + expectedThrows + '"');
      ++fail;
    }
  } else if (expectedThrows) {
    ++fail;
    LOG_THROW('_failed_ to throw ANY error', code, '', desc, true);
    if (expectedThrows !== true) {
      console.log('Expected an error message containing: "' + expectedThrows + '"');
    }
    console.log('Actual ast:', formatAst(obj.ast) + ',');
    console.log(
      'tokens: [$' +
      obj.tokens
      .slice(0, -1)
      .map(o => debug_toktype(o.type))
      .join(', $') +
      '],',
    );
  } else {
    let mustVerify = checkAST && expectedAst !== true;
    let expectedJson = mustVerify && JSON.stringify(expectedAst); // note: do not ignore prop order because there are perf implications if the order is not fixed
    let actualJson = (mustVerify  || expectedCallback !== undefined) && JSON.stringify(obj.ast);
    if (mustVerify && expectedJson !== actualJson) {
      let missingAst = expectedJson === '{"<not given>":true}';

      LOG_THROW(missingAst ? 'AST missing' : 'AST mismatch', code, '', desc, true);

      console.log('Actual ast:', formatAst(obj.ast) + ',');
      console.log(
        'tokens: [$' +
        obj.tokens
        .slice(0, -1)
        .map(o => debug_toktype(o.type))
        .join(', $') +
        '],',
      );

      if (missingAst) {
        console.log('(No expected AST given...)');
      } else {
        printComparedAstStrings(expectedJson, actualJson);
      }

      ++fail;
    } else if (expectedTokens !== true && obj.tokens.map(t => t.type).join(' ') !== [...expectedTokens, $EOF].join(' ')) {
      LOG_THROW(BOLD + 'TOKEN' + RESET + ' mismatch', code, '', desc, true);

      console.log('Actual tokens:', obj.tokens.map(t => debug_toktype(t.type)).join(' '));
      console.log('Wanted tokens:', [...expectedTokens, $EOF].map(debug_toktype).join(' '));
      // the tokenizer is pretty solid by now so I prefer to lazily copy/paste this into the test :)
      console.log(
        'tokens: [$' +
        obj.tokens
        .slice(0, -1)
        .map(o => debug_toktype(o.type))
        .join(', $') +
        '],',
      );
      ++fail;
    } else if (expectedCallback && expectedCallback(obj.ast, obj.tokens, actualJson) === false) {
      LOG_THROW('input parsed properly but ' + BOLD + 'CALLBACK' + RESET + ' rejected', code, undefined, desc);
      ++fail;
    } else {

      let babelAst;
      if (
        babelParse
        && ES === undefined // Babel parser simply supports the latest so no point testing older es versions
        && WEB === undefined // Actually I think Babel implicitly does this by default...? Should check
        && OPTIONS === undefined // Don't test special cases
      ) try {
        // https://babeljs.io/docs/en/babel-parser
        babelAst = babelParse(code, {
          sourceType: goalMode === GOAL_MODULE ? 'module' : 'script',
          strictMode: startInStrictMode ? true : false,
          plugins: ['estree'],
        }).program;
      } catch (e) {
        // Ignore babel exceptions for now. We should confirm and could then report them upstream later.
        console.log('Babel crashed on this input:' + e.message);
      }
      if (
        babelAst
      ) {
        let banned = {
          always: [
            'extra', 'start', 'end', 'loc', 'sourceType', 'interpreter', 'directives', 'cooked', 'raw',
          ],
          FunctionDeclaration: ['expression'],
          FunctionExpression: ['expression'],
          Literal: [
            'regex', // on regex literals
            'value', // TODO: fix literal nodes
          ],
          TryStatement: [
            'guardedHandlers', // dropped from estree spec very early on (some provide it to maintain backwards compat); https://github.com/jquery/esprima/issues/1030
          ],
        };
        let actualJson = serializeAst(obj.ast, banned);
        let babelJson = serializeAst(babelAst, banned);
        if (babelJson !== actualJson && ![
          // (It's annoying to use an index because as soon as I add a test before it all the numbers need to be updated. But it is easy...)
          77, // babel sets expressions=false for a function expression (TODO: all astexplorer parsers that _have expression_ also do this...?)
          516, // async arrow newline edge case (TODO: report to babel)
          549, // async arrow newline edge case (TODO: report to babel)
          1291, // regex asi case (TODO: report to babel)
          3492, // typoef async func regex edge case (TODO: report to babel)
        ].includes(testi)) {
          LOG_THROW('BABEL AST mismatch', code, '', desc, true);

          printComparedAstStrings(actualJson, babelJson, 'zePar', 'babel');

          console.log('ZeParser   AST:');
          console.dir(obj.ast, {depth: null});
          console.log('BabelParsr AST:');
          console.dir(orderAst(babelAst, banned), {depth: null});

          ++fail; // I guess...
        } else {
          babelAst = null;
        }
      }
      if (!babelAst) {
        console.log(`${prefix} ${GREEN}PASS${RESET}: \`${toPrint(code)}\`${suffix}`);
        ++pass;
      }
    }
  }

  if (STOP_AFTER_FAIL && fail) throw BOLD + RED + 'stopped';
  if (brake) throw BOLD + RED + 'stopped for test';

  function LOG_THROW(errmsg, code, stack = new Error(errmsg).stack, desc, noPartial = false) {
    console.log('\n');
    console.log(tokenizer.GETPOS(BOLD + '#|#' + RESET));
    if (TEST262) console.log('\n============== input ==============' + code + '\n============== /input =============\n');
    console.log(`${prefix} ${RED}ERROR${RESET}: \`${toPrint(code)}\` :: ` + errmsg + suffix);
    if (stack) {
      console.log(
        'Stack:',
        stack
        .replace(/Parser error!([^\n]*)/, 'Parser error!' + BOLD + RED + '$1' + RESET)
        .replace(/\n.* at (THROW|ASSERT\().*?\n/s, '\nExplicit '+BOLD+'$1'+RESET+' at:\n')
        .replace(/(zeparser.spec.js.*?)\n.*/s, '$1 (trunced remainder of trace)')
      );
    }
    //console.log('Final test options:\n', finalTestOptions);
    console.log('Description:', desc);
    console.log('From:', from);

    if (!noPartial) {
      console.log('Ast so far (path=['+astPath+']):', formatAst(ast));
      console.log('Tokens so far:[', tokens.map(o => debug_toktype(o.type)).join(', '), ' ...]');
    }

    if (_debug) console.log('Debug:', _debug);
  }
}

function printComparedAstStrings(want, real, n1 = 'want', n2 = 'real') {
  let max = Math.max(want.length, real.length);
  let n = 0;
  let step = 200;
  let steps = 0;
  while (n < max) {
    let x1 = want.slice(Math.min(n, want.length), Math.min(n + step, want.length));
    let x2 = real.slice(Math.min(n, real.length), Math.min(n + step, real.length));
    if (x1 === x2) {
      console.log(n1 + '[' + steps + ']: SAME', x1);
      console.log(n2 + '[' + steps + ']: SAME', x2);
    } else {
      // try to highlight the difference area

      let start = 0;
      for (; start<x1.length; ++start) {
        if (x1[start] !== x2[start]) {
          break;
        }
      }
      if (start > 0 && /[\w\d]/.test(x1[start])) {
        do --start; while (start > 0 && /[\w\d]/.test(x1[start]));
      }
      let stop = x1.length;
      for (; stop-1 > start; --stop) {
        if (x1[stop-1] !== x2[stop-1]) {
          break;
        }
      }
      if (stop < x1.length && /[\w\d]/.test(x1[stop])) {
        do ++stop; while (stop < x1.length && /[\w\d]/.test(x1[stop]));
      }

      console.log(n1 + '[' + steps + ']: DIFF', x1.slice(0, start) + BOLD + x1.slice(start, stop) + RESET + x1.slice(stop));
      console.log(BOLD+n2+RESET+'[' + steps + ']: DIFF', x2.slice(0, start) + BOLD + x2.slice(start, stop) + RESET + x2.slice(stop));
    }

    n += step;
    ++steps;
  }
}

function orderAst(ast, banned) {
  let bannedByType = banned[ast.type] || [];
  let keys = Object.getOwnPropertyNames(ast).filter(key => !banned.always.includes(key) && !bannedByType.includes(key));
  let newobj = {};
  keys.sort((a,b) => a === 'type' ? -1 : b === 'type' ? 1 : a < b ? -1 : a > b ? 1 : 0).forEach(key => {
    if (ast[key] instanceof Array) {
      newobj[key] = ast[key].map(e => e && orderAst(e, banned));
    }
    else if (typeof ast[key] === 'object' && ast[key] !== null) {
      newobj[key] = orderAst(ast[key], banned);
    }
    else {
      newobj[key] = ast[key];
    }
  });
  return newobj;
}
function serializeAst(ast, banned = []) {
  ast = orderAst(ast, banned); // remove things we don't care to compare
  return JSON.stringify(ast);
}

function formatAst(ast) {
  // If you have no prettier installed then ignore this step. It's not crucial.
  if (!Prettier) return ast;

  // node_modules/.bin/prettier --no-bracket-spacing  --print-width 180 --single-quote --trailing-comma all --write <dir>
  return Prettier.format('(' + require('util').inspect(ast, false, null) + ')', {
    printWidth: 180,
    tabWidth: 2,
    useTabs: false,
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
    bracketSpacing: false,
    parser: 'babylon',
  }).replace(/(?:^;?\(?)|(?:\)[\s\n]*$)/g, '');
}

if (TEST262) console.log('Running test262 provided tests instead');
if (SKIP_TO) console.log('Warning: Skipping the first', SKIP_TO, 'tests');

let pass = 0;
let fail = 0;
let crash = 0;
let testi = 0;
let testj = 0;
let skips = 0;
let completed = false;
try {
  [
    [ZeParser, true, 'dev build'],
    //[ZeParserBuild, false, 'prod build'],
  ].forEach(([parser, hasAst, desc], i) => {
    checkAST = hasAst;
    parserDesc = '## ' + desc;
    all(parser, cases);
  });
  completed = true;
} finally {
  console.log(`
  #####
  ${completed?'':RED + 'INCOMPLETE! ' + RESET}passed: ${pass}, ${crash?(STOP_AFTER_FAIL?'':BLINK)+RED:''}crashed: ${crash}${crash?RESET:''}, ${(fail - crash)?RED:''}failed: ${fail - crash}${(fail - crash)?RESET:''}, skipped: ${skips}
  `);
}
