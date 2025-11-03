import { Challenge } from '@/components/shared/PlayMode';
import { Treap } from './treap';

export const getTreapChallenges = (treap: Treap): Challenge[] => [
  {
    id: 'balanced-tree',
    title: 'Build a Balanced Tree',
    description: 'Insert 5 values and maintain tree height ≤ 3',
    difficulty: 'easy',
    targetTime: 60,
    targetMoves: 5,
    goal: 'Insert values: 50, 30, 70, 20, 80. Keep the tree balanced.',
    hints: [
      'Treap automatically balances using random priorities',
      'The tree height should not exceed 3 levels',
      'Use sequential insertions for predictable results'
    ],
    checkCompletion: () => {
      const height = treap.getHeight();
      const size = treap.size();
      return size >= 5 && height <= 3;
    }
  },
  {
    id: 'find-elements',
    title: 'Search Challenge',
    description: 'Build a tree and successfully search for specific values',
    difficulty: 'easy',
    targetTime: 45,
    targetMoves: 8,
    goal: 'Insert 5 values and verify you can search for them all.',
    hints: [
      'Insert values first: 40, 20, 60, 10, 30',
      'Use search operation to find each value',
      'Search follows BST property: left < parent < right'
    ],
    checkCompletion: () => {
      return treap.size() >= 5 && 
             treap.search(40) !== null && 
             treap.search(20) !== null;
    }
  },
  {
    id: 'rotation-master',
    title: 'Rotation Master',
    description: 'Trigger at least 3 rotations by strategic insertions',
    difficulty: 'medium',
    targetTime: 90,
    targetMoves: 10,
    goal: 'Insert values in an order that triggers multiple rotations.',
    hints: [
      'Rotations occur when heap property is violated',
      'Try inserting in ascending or descending order',
      'Watch the priority values - higher priorities move up',
      'Rotations happen automatically to maintain heap property'
    ],
    checkCompletion: () => {
      const ops = treap.operations;
      const rotations = ops.filter(op => 
        op.type === 'rotate-left' || op.type === 'rotate-right'
      );
      return rotations.length >= 3;
    }
  },
  {
    id: 'delete-precision',
    title: 'Precision Deletion',
    description: 'Build a tree with 7 nodes, then delete 3 specific ones',
    difficulty: 'medium',
    targetTime: 120,
    targetMoves: 10,
    goal: 'Create a tree with 7 nodes, then delete middle values to maintain balance.',
    hints: [
      'Start with: 50, 30, 70, 20, 40, 60, 80',
      'Delete nodes carefully to maintain structure',
      'Deletion rotates nodes down before removing',
      'Final tree should still be balanced'
    ],
    checkCompletion: () => {
      return treap.size() === 4 && treap.getHeight() <= 3;
    }
  },
  {
    id: 'priority-puzzle',
    title: 'Priority Puzzle',
    description: 'Create a specific tree structure by understanding priorities',
    difficulty: 'hard',
    targetTime: 180,
    targetMoves: 15,
    goal: 'Build a tree where the root has the highest priority and leaves have lowest.',
    hints: [
      'Root must have maximum priority value',
      'Insert multiple values and observe their priorities',
      'If priority is too low, the node won\'t stay at root',
      'You might need to clear and retry to get right priorities',
      'Priorities are random - keep trying!'
    ],
    checkCompletion: () => {
      if (!treap.root || treap.size() < 5) return false;
      const rootPriority = treap.root.priority;
      
      const checkPriorities = (node: any): boolean => {
        if (!node) return true;
        if (node.left && node.left.priority > rootPriority) return false;
        if (node.right && node.right.priority > rootPriority) return false;
        return checkPriorities(node.left) && checkPriorities(node.right);
      };
      
      return checkPriorities(treap.root) && treap.size() >= 5;
    }
  }
];
