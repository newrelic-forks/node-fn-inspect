'use strict'
module.exports = {
  extends: '@newrelic',
  rules: {
    'header/header': 'off',
    'consistent-return': 'off'
  },
  parserOptions: {
    ecmaVersion: '2021'
  },
  overrides: [
    {
      files: ['index.test.js'],
      rules: {
        'func-names': 'off',
        'max-nested-callbacks': 'off',
        'no-shadow': ['warn', { allow: ['t', 'err', 'shim', 'error'] }],
        // TODO: remove these overrides as part of https://issues.newrelic.com/browse/NEWRELIC-5257
        'sonarjs/no-duplicate-string': 'off',
        'sonarjs/cognitive-complexity': 'off'
      }
    }
  ]
}
