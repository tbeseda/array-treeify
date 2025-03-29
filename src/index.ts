/**
 * Represents a node in the tree structure.
 * Can be either a string (a leaf node) or an array of TreeNodes (a branch with children).
 */
type TreeNode = string | TreeNode[]

/**
 * The strict tree input format. Must start with a string.
 * This type is exported for testing purposes and advanced usage.
 */
export type TreeInput = [string, ...Array<string | TreeNode[]>]

/**
 * Flexible input type that accepts any array.
 * Runtime validation ensures the first element is a string.
 */
type FlexibleTreeInput = readonly (string | unknown[])[]

const CHARS = {
  BRANCH: '├─ ',
  LAST_BRANCH: '└─ ',
  PIPE: '│  ',
  SPACE: '   ',
} as const

/**
 * @description Creates an ASCII tree representation from a nested array structure.
 *
 * The expected input format is a hierarchical structure where:
 * - The first element must be a string (the root node)
 * - String elements represent nodes at the current level
 * - Array elements following a string represent the children of the previous node
 * - Nested arrays create deeper levels in the tree
 *
 * Examples of supported formats:
 * - `['root', ['child1', 'child2', 'child3']]` creates a root with three children
 * - `['root', 'second', ['child1', 'child2']]` creates multiple root nodes with children
 * - `['root', ['child1', ['grandchild1', 'grandchild2']]]` creates a root with nested children
 * - `['root', ['childA', ['grandchildA'], 'childB']]` creates multiple branches
 *
 * The output uses ASCII characters to visualize the tree structure.
 *
 * @param list {FlexibleTreeInput} - An array representing the tree structure. First element must be a string.
 * @returns {string} A string containing the ASCII tree representation
 *
 * @example
 * treeify(['root', ['child1', 'child2', ['grandchild']]])
 * //   root
 * //   ├─ child1
 * //   └─ child2
 * //      └─ grandchild
 */
export function treeify(list: FlexibleTreeInput): string {
  if (!Array.isArray(list) || list.length === 0) return ''
  if (list[0] === undefined) return ''
  if (typeof list[0] !== 'string')
    throw new Error('First element must be a string')

  const result: string[] = []

  result.push(list[0]) // first string is the root

  let i = 1
  while (i < list.length) {
    const node = list[i]

    if (typeof node === 'string') {
      // add strings here
      result.push(node)
      i++
    } else if (Array.isArray(node)) {
      // array is the children of the previous item
      renderTreeNodes(node, '', result)
      i++
    } else {
      // idk. skip it.
      i++
    }
  }

  return result.join('\n')
}

/**
 * @description Renders tree nodes with appropriate ASCII indentation and branching
 */
function renderTreeNodes(
  nodes: TreeNode[],
  indent: string,
  result: string[],
): void {
  if (!Array.isArray(nodes) || nodes.length === 0) return

  const parentNodeIndices = findParentNodeIndices(nodes)

  let i = 0
  while (i < nodes.length) {
    const node = nodes[i]
    const isParentNode = parentNodeIndices.has(i)

    if (isParentNode) {
      const parentIndex = i
      const childrenIndex = i + 1
      const stringNode = nodes[parentIndex] as string
      const arrayNode = nodes[childrenIndex] as TreeNode[]

      const isLast = !hasNextStringNode(nodes, childrenIndex + 1)

      const prefix = isLast ? CHARS.LAST_BRANCH : CHARS.BRANCH
      result.push(indent + prefix + stringNode)

      // children with increased indent
      const childIndent = indent + (isLast ? CHARS.SPACE : CHARS.PIPE)
      renderTreeNodes(arrayNode, childIndent, result)

      // skip both the parent node and its children array
      i += 2
    } else if (typeof node === 'string') {
      // string is simple. add it.
      const isLast = !hasNextStringNode(nodes, i + 1)
      const prefix = isLast ? CHARS.LAST_BRANCH : CHARS.BRANCH
      result.push(indent + prefix + node)
      i++
    } else if (Array.isArray(node)) {
      // (>_>)
      const isLast = i === nodes.length - 1
      const childIndent = indent + (isLast ? CHARS.SPACE : CHARS.PIPE)
      renderTreeNodes(node, childIndent, result)
      i++
    } else {
      // (0_o)
      i++
    }
  }
}

/**
 * @description Locate parent nodes in the array to handle nesting.
 */
function findParentNodeIndices(nodes: TreeNode[]): Set<number> {
  const parentNodeIndices = new Set<number>()

  for (let i = 0; i < nodes.length; i++) {
    if (
      typeof nodes[i] === 'string' &&
      i + 1 < nodes.length &&
      Array.isArray(nodes[i + 1])
    ) {
      parentNodeIndices.add(i)
    }
  }

  return parentNodeIndices
}

/**
 * @description
 *   Determines if there's another string node after the given index.
 *   Used to decide if the current node is the last at its level.
 */
function hasNextStringNode(nodes: TreeNode[], startIndex: number): boolean {
  for (let i = startIndex; i < nodes.length; i++) {
    if (typeof nodes[i] === 'string') {
      return true
    }
  }
  return false
}
