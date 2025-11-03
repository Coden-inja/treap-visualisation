/**
 * Count the total number of nodes in the tree
 */
function countNodes(node: TreapNode | null): number {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

/**
 * Get color based on priority value
 */
export function getPriorityColor(priority: number): string {
  // Normalize priority to 0-1 range
  const normalized = Math.min(Math.max(priority, 0), 1);
  
  // HSL color interpolation (from green to yellow to red)
  const hue = normalized * 120; // 120 for green, 60 for yellow, 0 for red
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Get glow color based on priority value
 */
export function getPriorityGlow(priority: number): string {
  const baseColor = getPriorityColor(priority);
  return `${baseColor}33`; // Add 20% opacity
}