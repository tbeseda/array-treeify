import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { treeify } from './index.js'
import type { TreeInput } from './index.js'

describe('treeify types', () => {
  test('input values', () => {
    const inputWithValues: TreeInput = ['root', ['child1', 'child2', 'child3']]
    let result = treeify(inputWithValues)
    assert.ok(result)

    const emptyInput: TreeInput = []
    result = treeify(emptyInput)
    assert.equal(result, '') // empty string

    const inputBuildUp: TreeInput = []
    inputBuildUp.push('root')
    inputBuildUp.push(['child1', 'child2', 'child3'])
    inputBuildUp.push('root2', ['cousin1', 'cousin2', 'cousin3'])
    result = treeify(inputBuildUp)
    assert.ok(result)

    // @ts-expect-error
    const inputWithoutRootString: TreeInput = [{ bad: 'root' }, 'root2']
    assert.throws(() => treeify(inputWithoutRootString), {
      message: 'First element must be a string',
    })

    const inputWithRootStringAndInvalidValues: TreeInput = ['root']
    // @ts-expect-error
    inputWithRootStringAndInvalidValues.push(1)
    // @ts-expect-error
    inputWithRootStringAndInvalidValues.push({}, [], Number.POSITIVE_INFINITY)
    result = treeify(inputWithRootStringAndInvalidValues)
    assert.ok(result) // non-strings are ignored
  })

  test('generated inputs', () => {
    function generateInput(): TreeInput {
      const out: TreeInput = []
      out.push('root')
      out.push(['child1', 'child2', 'child3'])
      return out
    }

    const input: TreeInput = ['root', generateInput()]
    input.push(generateInput())

    assert.ok(treeify(input))
  })
})
