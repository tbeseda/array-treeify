/**
 * The strict tree input format. Must start with a string.
 * This type is exported for testing purposes and advanced usage.
 */
export type TreeInput = Array<string | TreeInput>

/**
 * A value rendered as a node label. Anything that isn't an array is a label;
 * non-strings are stringified.
 */
type TreeLeaf = string | number | bigint | boolean

/**
 * Flexible input type that accepts labels and nested arrays.
 * Runtime validation ensures the first element is a string.
 */
type FlexibleTreeInput = readonly (TreeLeaf | readonly unknown[])[]

/**
 * @description An array is a branch (the children of the node before it);
 * anything else is a leaf.
 */
function isBranch(node: unknown): node is readonly unknown[] {
  return Array.isArray(node)
}

/**
 * @description Describes a value for error messages without dumping its contents.
 */
function describe(value: unknown): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'an array'
  const type = typeof value
  if (type === 'number' || type === 'bigint' || type === 'boolean')
    return `${type} (${String(value)})`
  return type
}

/**
 * ASCII characters used to render the tree.
 */
export type TreeChars = {
  branch: string
  lastBranch: string
  pipe: string
  space: string
}

const DEFAULT_CHARS: TreeChars = {
  branch: '├─ ',
  lastBranch: '└─ ',
  pipe: '│  ',
  space: '   ',
} as const
const SPACE = ' ' as const
const EMPTY_CHARS: TreeChars = {
  branch: SPACE.repeat(DEFAULT_CHARS.branch.length),
  lastBranch: SPACE.repeat(DEFAULT_CHARS.lastBranch.length),
  pipe: SPACE.repeat(DEFAULT_CHARS.pipe.length),
  space: SPACE.repeat(DEFAULT_CHARS.space.length),
} as const

/**
 * @description Creates a text tree representation from a nested array structure using Unicode box-drawing characters.
 *
 * The expected input format is a hierarchical structure where:
 * - The first element must be a string (the root node)
 * - Label elements represent nodes at the current level. Anything that isn't an
 *   array is a label, and non-strings are stringified
 * - Array elements following a label represent the children of that node
 * - Nested arrays create deeper levels in the tree
 *
 * Examples of supported formats:
 * - `['root', ['child1', 'child2', 'child3']]` creates a root with three children
 * - `['root', 'second', ['child1', 'child2']]` creates multiple root nodes with children
 * - `['root', ['child1', ['grandchild1', 'grandchild2']]]` creates a root with nested children
 * - `['root', ['childA', ['grandchildA'], 'childB']]` creates multiple branches
 *
 * The output uses Unicode box-drawing characters to visualize the tree structure.
 *
 * @param list {FlexibleTreeInput} - An array representing the tree structure. First element must be a string.
 * @param options {Object} - An object containing optional configuration:
 *   - `chars` {TreeChars} - Custom characters for the tree. Defaults to Unicode box-drawing characters.
 *   - `plain` {boolean} - Whether to use plain whitespace characters instead of Unicode box-drawing characters.
 *
 * @returns {string} A string containing the tree representation. An empty array returns an empty string.
 *
 * @throws {TypeError} If `list` is not an array, or its first element is not a string.
 *
 * @example
 * treeify(['root', ['child1', 'child2', ['grandchild']]])
 * //   root
 * //   ├─ child1
 * //   └─ child2
 * //      └─ grandchild
 */
export function treeify(
  list: FlexibleTreeInput,
  options?: {
    chars?: TreeChars
    plain?: boolean
  },
): string {
  if (!Array.isArray(list))
    throw new TypeError(
      `array-treeify: expected an array, received ${describe(list)}`,
    )
  if (list.length === 0) return ''
  if (typeof list[0] !== 'string')
    throw new TypeError(
      `array-treeify: expected the first element to be a string, received ${describe(list[0])}`,
    )

  let chars = DEFAULT_CHARS
  if (options?.plain) chars = EMPTY_CHARS
  if (options?.chars) chars = options.chars

  const result: string[] = []

  result.push(list[0]) // first string is the root

  let i = 1
  while (i < list.length) {
    const node = list[i]

    if (isBranch(node)) {
      // array is the children of the previous item
      renderTreeNodes(node, '', result, chars)
    } else {
      // everything else is a label
      result.push(String(node))
    }

    i++
  }

  return result.join('\n')
}

/**
 * @description Renders tree nodes with appropriate ASCII indentation and branching
 */
function renderTreeNodes(
  nodes: readonly unknown[],
  indent: string,
  result: string[],
  chars: TreeChars,
): void {
  if (nodes.length === 0) return

  const parentNodeIndices = findParentNodeIndices(nodes)

  let i = 0
  while (i < nodes.length) {
    const node = nodes[i]

    if (parentNodeIndices.has(i)) {
      // a leaf followed by an array: that array holds its children
      const children = nodes[i + 1] as readonly unknown[]
      const isLast = !hasNextLeaf(nodes, i + 2)

      const prefix = isLast ? chars.lastBranch : chars.branch
      result.push(indent + prefix + String(node))

      // children with increased indent
      const childIndent = indent + (isLast ? chars.space : chars.pipe)
      renderTreeNodes(children, childIndent, result, chars)

      // skip both the parent node and its children array
      i += 2
    } else if (isBranch(node)) {
      // an array with no leaf before it. (>_>) render it a level deeper.
      const isLast = i === nodes.length - 1
      const childIndent = indent + (isLast ? chars.space : chars.pipe)
      renderTreeNodes(node, childIndent, result, chars)
      i++
    } else {
      // a leaf is simple. add it.
      const isLast = !hasNextLeaf(nodes, i + 1)
      const prefix = isLast ? chars.lastBranch : chars.branch
      result.push(indent + prefix + String(node))
      i++
    }
  }
}

/**
 * @description Locate parent nodes in the array to handle nesting.
 */
function findParentNodeIndices(nodes: readonly unknown[]): Set<number> {
  const parentNodeIndices = new Set<number>()

  for (let i = 0; i < nodes.length; i++) {
    if (!isBranch(nodes[i]) && isBranch(nodes[i + 1])) {
      parentNodeIndices.add(i)
    }
  }

  return parentNodeIndices
}

/**
 * @description
 *   Determines if there's another leaf after the given index.
 *   Used to decide if the current node is the last at its level.
 */
function hasNextLeaf(nodes: readonly unknown[], startIndex: number): boolean {
  for (let i = startIndex; i < nodes.length; i++) {
    if (!isBranch(nodes[i])) {
      return true
    }
  }
  return false
}
