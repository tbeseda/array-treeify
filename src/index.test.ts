import assert from 'node:assert'
import { describe, test } from 'node:test'
import { type TreeInput, treeify } from './index.js'

describe('treeify utility', () => {
  test('basic tree with root and children', () => {
    const input: TreeInput = ['root', ['child1', 'child2', 'child3']]
    const expected = `root
├─ child1
├─ child2
└─ child3`

    const result = treeify(input)
    console.log('\nBasic tree with root and children:')
    console.log(result)
    assert.strictEqual(result, expected)
  })

  test('tree with nested children', () => {
    const input: TreeInput = [
      'foo',
      ['bar', 'baz', 'corge', ['qux', ['qui', 'grault', 'garply']]],
    ]
    const expected = `foo
├─ bar
├─ baz
└─ corge
   └─ qux
      ├─ qui
      ├─ grault
      └─ garply`

    const result = treeify(input)
    console.log('\nTree with nested children:')
    console.log(result)
    assert.strictEqual(result, expected)
  })

  test('deeply nested tree', () => {
    const input: TreeInput = [
      'root',
      [
        'level1-1',
        [
          'level2-1',
          'level2-2',
          ['level3-1', 'level3-2', ['level4-1', 'level4-2']],
        ],
        'level1-2',
      ],
    ]
    const expected = `root
├─ level1-1
│  ├─ level2-1
│  └─ level2-2
│     ├─ level3-1
│     └─ level3-2
│        ├─ level4-1
│        └─ level4-2
└─ level1-2`

    const result = treeify(input)
    console.log('\nDeeply nested tree:')
    console.log(result)
    assert.strictEqual(result, expected)
  })

  test('tree with multiple deep branches', () => {
    const input: TreeInput = [
      'root',
      [
        'branch1',
        ['leaf2-1', ['leaf3-1', 'leaf3-2']],
        'branch2',
        ['leaf2-1', ['leaf3-1', ['leaf4-1', 'leaf4-2']]],
        'leaf1',
      ],
    ]
    const expected = `root
├─ branch1
│  └─ leaf2-1
│     ├─ leaf3-1
│     └─ leaf3-2
├─ branch2
│  └─ leaf2-1
│     └─ leaf3-1
│        ├─ leaf4-1
│        └─ leaf4-2
└─ leaf1`

    const result = treeify(input)
    console.log('\nTree with multiple deep branches:')
    console.log(result)
    assert.strictEqual(result, expected)
  })

  test('empty array returns empty string', () => {
    assert.strictEqual(treeify([] as unknown as TreeInput), '')
  })

  test('array with only a root returns only the root', () => {
    assert.strictEqual(treeify(['root'] as TreeInput), 'root')
  })

  test('multiple strings at root level', () => {
    const input: TreeInput = ['root', 'second', ['child1', 'child2']]
    const expected = `root
second
├─ child1
└─ child2`

    const result = treeify(input)
    console.log('\nMultiple strings at root level:')
    console.log(result)
    assert.strictEqual(result, expected)
  })

  test('consumer-friendly without type annotations', () => {
    // These don't need type annotations anymore - TypeScript can infer them
    const input1 = ['root', ['child1', 'child2']]
    const input2 = ['parent', 'sibling', ['child1', 'child2']]
    const input3 = ['top', ['middle', ['bottom']]]

    // All of these should work without type errors
    assert.ok(treeify(input1).includes('root'))
    assert.ok(treeify(input2).includes('sibling'))
    assert.ok(treeify(input3).includes('middle'))

    console.log('\nConsumer examples without type annotations:')
    console.log(treeify(input1))
    console.log(`\n${treeify(input2)}`)
    console.log(`\n${treeify(input3)}`)
  })
})

describe('readme examples', () => {
  test('basic example', () => {
    const eagan = [
      'Kier Eagan',
      ['...', ['...', 'Jame Eagan', ['Helena Eagan']]],
      'Ambrose Eagan',
    ]
    const expected = `Kier Eagan
├─ ...
|  ├─ ...
|  └─ Jame Eagan
|     └─ Helena Eagan
└─ Ambrose Eagan`

    const result = treeify(eagan)
    console.log('\nBasic example:')
    console.log(result)
    assert.strictEqual(result, expected)
  })

  test('nested example', () => {
    const orgChart = [
      'Lumon Industries',
      [
        'Board of Directors',
        ['Natalie (Representative)'],
        'Department Heads',
        [
          'Cobel (MDR)',
          ['Milchick', 'Mark S.', ['Dylan G.', 'Irving B.', 'Helly R.']],
        ],
      ],
    ]
    const expected = `Lumon Industries
├─ Board of Directors
│  └─ Natalie (Representative)
└─ Department Heads
   └─ Cobel (MDR)
      ├─ Milchick
      └─ Mark S.
         ├─ Dylan G.
         ├─ Irving B.
         └─ Helly R.`

    const result = treeify(orgChart)
    console.log('\nNested example:')
    console.log(result)
    assert.strictEqual(result, expected)
  })
})
