import assert from 'node:assert'
import { describe, test } from 'node:test'
import { treeify } from './index.js'

describe('readme examples', () => {
  test('basic example', () => {
    const eagan = [
      'Kier Eagan',
      ['...', ['...', 'Jame Eagan', ['Helena Eagan']], 'Ambrose Eagan'],
    ]
    const expected = `Kier Eagan
├─ ...
│  ├─ ...
│  └─ Jame Eagan
│     └─ Helena Eagan
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
