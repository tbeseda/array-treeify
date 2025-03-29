# 🪾 `array-treeify`

**Simple ASCII trees from arrays. For your terminal and console displays.**

[![typescript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![npm](https://img.shields.io/npm/v/array-treeify.svg)](https://www.npmjs.com/package/array-treeify)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/tbeseda/array-treeify/blob/main/LICENSE)

## Overview

`array-treeify` transforms nested arrays into beautiful ASCII trees with proper branching characters. Perfect for CLIs, debug outputs, or anywhere you need to visualize hierarchical data.

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

## Usage

```typescript
function treeify(input: TreeInput): string
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
  ],
  'Ambrose Eagan'
]
console.log(treeify(eagan))
/*
Kier Eagan
├─ ...
|  ├─ ...
|  └─ Jame Eagan
|     └─ Helena Eagan
└─ Ambrose Eagan
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
2. Subsequent elements can be strings (nodes at same level) or arrays (children of previous node)
3. Arrays can be nested to any depth

```typescript
['root', 'sibling', ['child1', 'child2']]             // Root with 2 children
['root', ['child'], 'sibling', ['nephew', 'niece']]   // 2 root nodes with children
['root', ['child', ['grandchild']]]                   // Grandchildren
```

## License

MIT © tbeseda
