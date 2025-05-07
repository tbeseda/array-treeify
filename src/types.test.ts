import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { treeify } from './index.js'
import type { TreeInput } from './index.js'

describe('treeify types', () => {
  test('input with values', () => {
    const inputWithValues: TreeInput = ['root', ['child1', 'child2', 'child3']]
    let result = treeify(inputWithValues)
    assert.ok(result)

    const inputWithoutValues: TreeInput = []
    result = treeify(inputWithoutValues)
    assert.equal(result, '') // empty string

    // @ts-expect-error
    const inputWithoutRootString: TreeInput = [{ bad: 'root' }, 'root2']
    assert.throws(() => treeify(inputWithoutRootString), {
      message: 'First element must be a string',
    })

    // @ts-expect-error
    const inputWithRootStringAndInvalidValues: TreeInput = [
      'root',
      1,
      {},
      ['child1', 'child2', 'child3'],
    ]
    result = treeify(inputWithRootStringAndInvalidValues)
    assert.ok(result) // non-strings are ignored
  })
})
