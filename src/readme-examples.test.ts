import assert from 'node:assert'
import { describe, test } from 'node:test'
import { treeify } from './index.js'

describe('readme examples', () => {
  test('org chart example', () => {
    const orgChart = treeify([
      'Lumon Industries',
      [
        'Board of Directors',
        ['Natalie (Representative)'],
        'Departments',
        [
          'Macrodata Refinement (Cobel)',
          ['Milchick', 'Mark S.', ['Dylan G.', 'Irving B.', 'Helly R.']],
        ],
        'Other Departments',
        [
          'Optics & Design',
          'Wellness Center',
          'Mammalians Nurturable',
          'Choreography and Merriment',
        ],
      ],
    ])
    const expected = `Lumon Industries
├─ Board of Directors
│  └─ Natalie (Representative)
├─ Departments
│  └─ Macrodata Refinement (Cobel)
│     ├─ Milchick
│     └─ Mark S.
│        ├─ Dylan G.
│        ├─ Irving B.
│        └─ Helly R.
└─ Other Departments
   ├─ Optics & Design
   ├─ Wellness Center
   ├─ Mammalians Nurturable
   └─ Choreography and Merriment`

    console.log('\nOrg chart example:')
    console.log(orgChart)
    assert.strictEqual(orgChart, expected)
  })

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

    const expectedPlain = `Kier Eagan
   ...
      ...
      Jame Eagan
         Helena Eagan
   Ambrose Eagan`
    const resultPlain = treeify(eagan, { plain: true })
    console.log('\nBasic example (plain):')
    console.log(resultPlain)
    assert.strictEqual(resultPlain, expectedPlain)

    const expectedCustomChars = `Kier Eagan
├• ...
│  ├• ...
│  └• Jame Eagan
│     └• Helena Eagan
└• Ambrose Eagan`
    const resultCustomChars = treeify(eagan, {
      chars: { branch: '├• ', lastBranch: '└• ', pipe: '│  ', space: '   ' },
    })
    console.log('\nBasic example (custom chars):')
    console.log(resultCustomChars)
    assert.strictEqual(resultCustomChars, expectedCustomChars)
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
