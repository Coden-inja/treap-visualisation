import { LearningStep } from '@/components/shared/LearnMode';
import { Treap } from './treap';

export const getTreapLearnSteps = (treap: Treap, onUpdate: () => void): LearningStep[] => [
  {
    id: 'intro',
    title: 'Introduction to Treaps',
    description: 'A Treap combines Binary Search Tree and Heap properties for efficient operations.',
    pseudocode: [
      'Treap Properties:',
      '1. BST Property: left.key < parent.key < right.key',
      '2. Heap Property: parent.priority > children.priority',
      '3. Priorities are random → balanced structure',
      '4. Average O(log n) for insert, delete, search'
    ],
    highlightNodes: []
  },
  {
    id: 'insert-1',
    title: 'Step 1: Insert First Node',
    description: 'Insert value 50 as the root. It gets a random priority.',
    pseudocode: [
      'function insert(key):',
      '  priority = random(1, 100)',
      '  node = new Node(key, priority)',
      '  if root is null:',
      '    root = node',
      '    return'
    ],
    actionLabel: 'Insert 50',
    action: () => {
      treap.insert(50);
      onUpdate();
    }
  },
  {
    id: 'insert-2',
    title: 'Step 2: Insert Left Child',
    description: 'Insert 30. It goes left of 50 (BST property). Check heap property.',
    pseudocode: [
      'Insert like BST:',
      '  if key < node.key:',
      '    go left',
      '  else:',
      '    go right',
      'After insert, check heap property and rotate if needed'
    ],
    actionLabel: 'Insert 30',
    action: () => {
      treap.insert(30);
      onUpdate();
    }
  },
  {
    id: 'insert-3',
    title: 'Step 3: Insert Right Child',
    description: 'Insert 70. It goes right of 50 (BST property).',
    pseudocode: [
      'Continue BST insertion...',
      'if priority violates heap property:',
      '  if left child has higher priority:',
      '    rotateRight()',
      '  if right child has higher priority:',
      '    rotateLeft()'
    ],
    actionLabel: 'Insert 70',
    action: () => {
      treap.insert(70);
      onUpdate();
    }
  },
  {
    id: 'rotations',
    title: 'Step 4: Understanding Rotations',
    description: 'Rotations maintain BST property while fixing heap violations.',
    pseudocode: [
      'Right Rotation (when left child priority > parent):',
      '     P                L',
      '    / \\      =>      / \\',
      '   L   R            A   P',
      '  / \\                  / \\',
      ' A   B                B   R',
      '',
      'Left Rotation (when right child priority > parent):',
      '   P                  R',
      '  / \\        =>      / \\',
      ' L   R              P   B',
      '    / \\            / \\',
      '   A   B          L   A'
    ],
    actionLabel: 'Insert 20 (may trigger rotation)',
    action: () => {
      treap.insert(20);
      onUpdate();
    }
  },
  {
    id: 'search',
    title: 'Step 5: Search Operation',
    description: 'Search follows BST property - O(log n) average time.',
    pseudocode: [
      'function search(key):',
      '  node = root',
      '  while node is not null:',
      '    if key == node.key:',
      '      return node',
      '    if key < node.key:',
      '      node = node.left',
      '    else:',
      '      node = node.right',
      '  return null'
    ]
  },
  {
    id: 'delete',
    title: 'Step 6: Delete Operation',
    description: 'Delete rotates the node down until it becomes a leaf, then removes it.',
    pseudocode: [
      'function delete(key):',
      '  node = search(key)',
      '  while node has children:',
      '    if left.priority > right.priority:',
      '      rotateRight(node)',
      '    else:',
      '      rotateLeft(node)',
      '  remove leaf node'
    ]
  }
];
