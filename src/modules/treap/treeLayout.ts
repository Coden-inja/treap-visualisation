/**
 * Tree Layout Algorithm
 * Calculates x, y positions for each node in the tree
 */

import { TreapNode } from './treap';

export interface LayoutNode {
  node: TreapNode;
  x: number;
  y: number;
  level: number;
}

export interface TreeEdge {
  from: LayoutNode;
  to: LayoutNode;
}

/**
 * Calculate tree layout for visualization
 */
export function calculateTreeLayout(
  root: TreapNode | null,
  width: number,
  height: number
): { nodes: LayoutNode[]; edges: TreeEdge[] } {
  const nodes: LayoutNode[] = [];
  const edges: TreeEdge[] = [];
  
  // Ensure minimum dimensions even when empty
  width = Math.max(width, 800);
  height = Math.max(height, 600);

  if (!root) {
    return { nodes: [], edges: [] };
  }
  
  const depth = getTreeDepth(root);
  const nodeCount = countNodes(root);
  
  // Calculate dimensions
  const levelHeight = height / (depth + 1); // Distribute height evenly
  const horizontalSpacing = Math.max(80, width / (nodeCount + 1));
  
  // Calculate total tree dimensions
  const treeWidth = (nodeCount - 1) * horizontalSpacing;
  const treeHeight = depth * levelHeight;
  
  // Start positions (centered around 0,0)
  const startX = -treeWidth / 2;
  const startY = -treeHeight / 2;
  
  // Assign positions using modified Reingold-Tilford algorithm
  assignPositions(root, 0, startX, startX + treeWidth, startY, levelHeight, nodes, edges);

  // Return positions centered around origin
  return { nodes, edges };

  return { nodes, edges };
}

/**
 * Get the maximum depth of the tree
 */
/**
 * Count the total number of nodes in the tree
 */
function countNodes(node: TreapNode | null): number {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

/**
 * Get the maximum depth of the tree
 */
function getTreeDepth(node: TreapNode | null): number {
  if (!node) return 0;
  return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
}

/**
 * Assign x, y positions to nodes recursively
 */
function assignPositions(
  node: TreapNode | null,
  level: number,
  leftBound: number,
  rightBound: number,
  startY: number,
  levelHeight: number,
  nodes: LayoutNode[],
  edges: TreeEdge[],
  parent?: LayoutNode
): LayoutNode | null {
  if (!node) return null;

  const x = (leftBound + rightBound) / 2;
  const y = startY + level * levelHeight;

  const layoutNode: LayoutNode = {
    node,
    x,
    y,
    level,
  };

  nodes.push(layoutNode);

  // Add edge from parent if exists
  if (parent) {
    edges.push({
      from: parent,
      to: layoutNode,
    });
  }

  // Calculate space for children
  const mid = (leftBound + rightBound) / 2;

  // Recursively position left and right children
  assignPositions(
    node.left,
    level + 1,
    leftBound,
    mid,
    startY,
    levelHeight,
    nodes,
    edges,
    layoutNode
  );

  assignPositions(
    node.right,
    level + 1,
    mid,
    rightBound,
    startY,
    levelHeight,
    nodes,
    edges,
    layoutNode
  );

  return layoutNode;
}

/**
 * Get priority color class based on priority value
 */
export function getPriorityColor(priority: number): string {
  if (priority >= 80) return 'hsl(var(--priority-high))';      // Red - Very high
  if (priority >= 60) return 'hsl(var(--priority-mid-high))'; // Pink - High
  if (priority >= 40) return 'hsl(var(--priority-mid))';      // Purple - Medium
  if (priority >= 20) return 'hsl(var(--priority-mid-low))';  // Cyan - Low
  return 'hsl(var(--priority-low))';                          // Blue - Very low
}

/**
 * Get priority glow intensity
 */
export function getPriorityGlow(priority: number): string {
  const intensity = priority / 100;
  return `0 0 ${10 + intensity * 20}px currentColor, 0 0 ${20 + intensity * 40}px currentColor`;
}
