# 🪾 `array-treeify`

**Simple text trees from arrays using Unicode box-drawing characters. For your terminal and console displays.**

[![typescript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![npm](https://img.shields.io/npm/v/array-treeify.svg)](https://www.npmjs.com/package/array-treeify)
[![ci](https://github.com/tbeseda/array-treeify/actions/workflows/ci.yml/badge.svg)](https://github.com/tbeseda/array-treeify/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/tbeseda/array-treeify/blob/main/LICENSE)

## Overview

`array-treeify` transforms nested arrays into text trees with proper branching characters. Perfect for CLIs, debug outputs, or anywhere you need to visualize hierarchical data.

```typescript
treeify([
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
```


```
Lumon Industries
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
   └─ Choreography and Merriment
```

## Installation

```bash
npm install array-treeify
```

Zero dependencies, ESM only. Requires Node.js 22 or newer (or any runtime that supports ES modules).

## Usage

```typescript
function treeify(input: TreeInput, options?: {
  chars?: TreeChars,  // Custom characters for the tree
  plain?: boolean     // Use plain whitespace instead of Unicode box-drawing characters
}): string
```

`array-treeify` accepts a simple, intuitive array structure that's easy to build and manipulate:

```typescript
import {treeify} from 'array-treeify'

// Basic example
const eagan = [
  'Kier Eagan', 
  [
    '...',
    [
      '...',
      'Jame Eagan',
      ['Helena Eagan']
    ],
    'Ambrose Eagan',
  ],
]
console.log(treeify(eagan))
/*
Kier Eagan
├─ ...
│  ├─ ...
│  └─ Jame Eagan
│     └─ Helena Eagan
└─ Ambrose Eagan
*/

// Using custom characters
const resultCustomChars = treeify(
  eagan, 
  { chars: { branch: '├• ', lastBranch: '└• ', pipe: '│  ', space: '   ' },
})
/*
Kier Eagan
├• ...
│  ├• ...
│  └• Jame Eagan
│     └• Helena Eagan
└• Ambrose Eagan
*/

// Using plain whitespace characters
console.log(treeify(eagan, { plain: true }))
/*
Kier Eagan
   ...
      ...
      Jame Eagan
         Helena Eagan
   Ambrose Eagan
*/

// Nested example
const orgChart = [
  'Lumon Industries',
  [
    'Board of Directors',
    ['Natalie (Representative)'],
    'Department Heads',
    [
      'Cobel (MDR)',
      ['Milchick', 'Mark S.', ['Dylan G.', 'Irving B.', 'Helly R.']]
    ]
  ]
]
console.log(treeify(orgChart))
/*
Lumon Industries
├─ Board of Directors
│  └─ Natalie (Representative)
└─ Department Heads
   └─ Cobel (MDR)
      ├─ Milchick
      └─ Mark S.
         ├─ Dylan G.
         ├─ Irving B.
         └─ Helly R.
*/
```

## Input Format

The `treeify` function accepts arrays with the following structure:

1. First element must be a string (the root node)
2. Subsequent elements can be labels (nodes at same level) or arrays (children of previous node)
3. Arrays can be nested to any depth

```typescript
['root', 'sibling', ['child1', 'child2']]             // Root with 2 children
['root', ['child'], 'sibling', ['nephew', 'niece']]   // 2 root nodes with children
['root', ['child', ['grandchild']]]                   // Grandchildren
```

### Labels

Any value that isn't an array is a label. Non-strings are stringified, so numbers and booleans work anywhere a string does — including as parent nodes:

```typescript
console.log(treeify(['deploys', [2025, ['spring', 'summer'], 2026, ['q1']]]))
/*
deploys
├─ 2025
│  ├─ spring
│  └─ summer
└─ 2026
   └─ q1
*/
```

### Errors

`treeify` throws a `TypeError` when it can't render what it was given:

- the input is not an array — `array-treeify: expected an array, received null`
- the first element is not a string — `array-treeify: expected the first element to be a string, received number (1)`

An empty array returns an empty string, so `treeify([])` is a safe way to say "nothing to render".

### Types

The exported `TreeInput` type (`Array<string | TreeInput>`) is intentionally permissive so trees can be assembled programmatically — build an array up with `push` and hand it over. A tuple type such as `[string, ...(string | TreeInput)[]]` *could* require a string first element at compile time, but it would rule out that dynamic construction, so the rule is enforced at runtime instead.

## Options

- `chars`: Custom characters for the tree. Defaults to Unicode box-drawing characters.
- `plain`: When true, uses plain whitespace characters instead of Unicode box-drawing characters.

## Development

Source lives in `src/` and runs directly on Node.js — the tests are `.ts` files executed by Node's built-in test runner and type stripping, so there's no build step or loader involved in testing. Node.js 22.18 or newer is required to work on the library.

```bash
npm test          # node --test
npm run typecheck # tsc, covers src/ including tests
npm run lint      # biome ci, no writes
npm run lint:write
npm run check     # typecheck + lint, what CI runs
npm run build     # emit dist/ with declarations
```

## License

MIT © tbeseda
