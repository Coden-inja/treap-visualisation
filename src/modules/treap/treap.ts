/**
 * Treap Data Structure Implementation
 * A Treap is a hybrid of a Binary Search Tree (BST) and a Heap
 * - BST property: left child < parent < right child (by key)
 * - Heap property: parent priority > child priority (max-heap)
 */

export class TreapNode {
  key: number;
  priority: number;
  left: TreapNode | null;
  right: TreapNode | null;
  
  // For visualization
  id: string;
  x?: number;
  y?: number;

  constructor(key: number, priority?: number) {
    this.key = key;
    this.priority = priority !== undefined ? priority : Math.floor(Math.random() * 100);
    this.left = null;
    this.right = null;
    this.id = `node-${key}-${Date.now()}-${Math.random()}`;
  }
}

export type TreapOperation = {
  type: 'insert' | 'delete' | 'search' | 'rotate-left' | 'rotate-right';
  key: number;
  priority?: number;
  found?: boolean;
  timestamp: number;
};

export class Treap {
  root: TreapNode | null;
  operations: TreapOperation[];

  constructor() {
    this.root = null;
    this.operations = [];
  }

  /**
   * Right rotation
   *    y                x
   *   / \              / \
   *  x   C    =>      A   y
   * / \                  / \
   * A  B                B   C
   */
  private rotateRight(y: TreapNode): TreapNode {
    const x = y.left!;
    const B = x.right;
    
    x.right = y;
    y.left = B;
    
    this.operations.push({
      type: 'rotate-right',
      key: y.key,
      timestamp: Date.now(),
    });
    
    return x;
  }

  /**
   * Left rotation
   *  x                  y
   * / \                / \
   * A  y       =>     x   C
   *   / \            / \
   *  B   C          A   B
   */
  private rotateLeft(x: TreapNode): TreapNode {
    const y = x.right!;
    const B = y.left;
    
    y.left = x;
    x.right = B;
    
    this.operations.push({
      type: 'rotate-left',
      key: x.key,
      timestamp: Date.now(),
    });
    
    return y;
  }

  /**
   * Insert a key with optional priority
   */
  insert(key: number, priority?: number): void {
    this.operations.push({
      type: 'insert',
      key,
      priority,
      timestamp: Date.now(),
    });
    
    this.root = this.insertHelper(this.root, key, priority);
  }

  private insertHelper(node: TreapNode | null, key: number, priority?: number): TreapNode {
    // Base case: create new node
    if (node === null) {
      return new TreapNode(key, priority);
    }

    // BST insertion
    if (key < node.key) {
      node.left = this.insertHelper(node.left, key, priority);
      
      // Maintain heap property
      if (node.left && node.left.priority > node.priority) {
        node = this.rotateRight(node);
      }
    } else if (key > node.key) {
      node.right = this.insertHelper(node.right, key, priority);
      
      // Maintain heap property
      if (node.right && node.right.priority > node.priority) {
        node = this.rotateLeft(node);
      }
    }
    // If key already exists, do nothing
    
    return node;
  }

  /**
   * Delete a key from the treap
   */
  delete(key: number): void {
    this.operations.push({
      type: 'delete',
      key,
      timestamp: Date.now(),
    });
    
    this.root = this.deleteHelper(this.root, key);
  }

  private deleteHelper(node: TreapNode | null, key: number): TreapNode | null {
    if (node === null) {
      return null;
    }

    if (key < node.key) {
      node.left = this.deleteHelper(node.left, key);
    } else if (key > node.key) {
      node.right = this.deleteHelper(node.right, key);
    } else {
      // Found the node to delete
      
      // Case 1: Leaf node
      if (node.left === null && node.right === null) {
        return null;
      }
      
      // Case 2: Only right child
      if (node.left === null) {
        return node.right;
      }
      
      // Case 3: Only left child
      if (node.right === null) {
        return node.left;
      }
      
      // Case 4: Both children exist
      // Rotate the child with higher priority to top, then recursively delete
      if (node.left.priority > node.right.priority) {
        node = this.rotateRight(node);
        node.right = this.deleteHelper(node.right, key);
      } else {
        node = this.rotateLeft(node);
        node.left = this.deleteHelper(node.left, key);
      }
    }
    
    return node;
  }

  /**
   * Search for a key
   */
  search(key: number): boolean {
    const found = this.searchHelper(this.root, key);
    
    this.operations.push({
      type: 'search',
      key,
      found,
      timestamp: Date.now(),
    });
    
    return found;
  }

  private searchHelper(node: TreapNode | null, key: number): boolean {
    if (node === null) {
      return false;
    }
    
    if (key === node.key) {
      return true;
    }
    
    if (key < node.key) {
      return this.searchHelper(node.left, key);
    } else {
      return this.searchHelper(node.right, key);
    }
  }

  /**
   * Inorder traversal (sorted order by key)
   */
  inorder(): number[] {
    const result: number[] = [];
    this.inorderHelper(this.root, result);
    return result;
  }

  private inorderHelper(node: TreapNode | null, result: number[]): void {
    if (node !== null) {
      this.inorderHelper(node.left, result);
      result.push(node.key);
      this.inorderHelper(node.right, result);
    }
  }

  /**
   * Preorder traversal
   */
  preorder(): number[] {
    const result: number[] = [];
    this.preorderHelper(this.root, result);
    return result;
  }

  private preorderHelper(node: TreapNode | null, result: number[]): void {
    if (node !== null) {
      result.push(node.key);
      this.preorderHelper(node.left, result);
      this.preorderHelper(node.right, result);
    }
  }

  /**
   * Level-order traversal (BFS)
   */
  levelorder(): number[] {
    const result: number[] = [];
    if (this.root === null) return result;
    
    const queue: TreapNode[] = [this.root];
    
    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node.key);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    return result;
  }

  /**
   * Get all nodes for visualization
   */
  getAllNodes(): TreapNode[] {
    const nodes: TreapNode[] = [];
    this.collectNodes(this.root, nodes);
    return nodes;
  }

  private collectNodes(node: TreapNode | null, nodes: TreapNode[]): void {
    if (node !== null) {
      nodes.push(node);
      this.collectNodes(node.left, nodes);
      this.collectNodes(node.right, nodes);
    }
  }

  /**
   * Export treap as JSON
   */
  toJSON(): string {
    return JSON.stringify(this.root, null, 2);
  }

  /**
   * Get recent operations
   */
  getRecentOperations(count: number = 10): TreapOperation[] {
    return this.operations.slice(-count);
  }

  /**
   * Clear all operations history
   */
  clearOperations(): void {
    this.operations = [];
  }

  /**
   * Get tree height
   */
  getHeight(): number {
    return this.getHeightHelper(this.root);
  }

  private getHeightHelper(node: TreapNode | null): number {
    if (node === null) return 0;
    return 1 + Math.max(this.getHeightHelper(node.left), this.getHeightHelper(node.right));
  }

  /**
   * Get tree size (number of nodes)
   */
  size(): number {
    return this.sizeHelper(this.root);
  }

  private sizeHelper(node: TreapNode | null): number {
    if (node === null) return 0;
    return 1 + this.sizeHelper(node.left) + this.sizeHelper(node.right);
  }

  /**
   * Get all operations
   */
  getOperations(): TreapOperation[] {
    return this.operations;
  }
}
