let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('member expression', _ => {

  test('function call, no args',{
    code: 'foo.bar',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'MemberExpression',
        object: {type: 'Identifier', name: 'foo'},
        property: {type: 'Identifier', name: 'bar'},
        computed: false,
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
});
