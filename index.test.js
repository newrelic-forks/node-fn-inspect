'use strict'
const test = require('node:test')
const assert = require('node:assert')
const { funcInfo } = require('.')

test('require in a worker thread succeeds after require in main thread', async function (t) {
  await t.test('require in main thread', function (t, end) {
    const { Worker } = require('worker_threads')
    const worker = new Worker(
      `
      const { funcInfo } = require('.')

      const info = funcInfo(() => {})

      process.exit(0)
    `,
      { eval: true }
    )

    worker.on('error', end)
    worker.on('exit', (exitCode) => {
      assert.equal(exitCode, 0)
      end()
    })
  })
})

test('funcInfo', async function (t) {
  const mod = require('./test/resources/module')
  const expectedPath = require.resolve('./test/resources/module.js')

  await t.test('returns the correct info for an arrow function', function () {
    const results = funcInfo(mod.arrow)

    assert.deepEqual(results, {
      column: 16,
      file: expectedPath,
      lineNumber: 3, // line numbers start at 0 in v8
      method: '',
      type: 'Function'
    })
  })

  await t.test('returns the correct info for a named function', function () {
    const results = funcInfo(mod.named)

    assert.deepEqual(results, {
      column: 30,
      file: expectedPath,
      lineNumber: 8, // line numbers start at 0 in v8
      method: 'named',
      type: 'Function'
    })
  })

  await t.test('returns the correct info for an anonymous function', function () {
    const results = funcInfo(mod.anon)

    assert.deepEqual(results, {
      column: 24,
      file: expectedPath,
      lineNumber: 10, // line numbers start at 0 in v8
      method: '',
      type: 'Function'
    })
  })

  await t.test('returns the correct info for an inline function', function () {
    function inline() {}

    const results = funcInfo(inline)
    assert.deepEqual(results, {
      column: 19,
      file: __filename,
      lineNumber: 68, // line numbers start at 0 in v8
      method: 'inline',
      type: 'Function'
    })
  })

  await t.test('returns the correct info for an async inline function', function () {
    async function inlineAsync() {}

    const results = funcInfo(inlineAsync)
    assert.deepEqual(results, {
      column: 30,
      file: __filename,
      lineNumber: 81, // line numbers start at 0 in v8
      method: 'inlineAsync',
      type: 'AsyncFunction'
    })
  })

  const nullTestCases = ['hi', 100, true, [1, 2, 3], { unit: 'test' }, undefined, null, '']
  for (const func of nullTestCases) {
    await t.test(`returns null for non-function values: ${func}`, function () {
      // @ts-expect-error these arguments are not functions
      const results = funcInfo(func)
      assert.equal(results, null)
    })
  }
})
