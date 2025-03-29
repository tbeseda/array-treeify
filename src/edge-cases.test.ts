import assert from 'node:assert'
import { describe, test } from 'node:test'
import { treeify } from './index.js'

describe('edge cases', () => {
  test('root with nested children and sibling', () => {
    const input = [
      'root',
      ['child1', ['grandchild1', 'grandchild2']],
      'sibling',
    ]
    const expected = `root
├─ child1
│  ├─ grandchild1
│  └─ grandchild2
└─ sibling`

    const result = treeify(input)
    console.log('\nRoot with nested children and sibling:')
    console.log(result)
    assert.strictEqual(result, expected)
  })
})
