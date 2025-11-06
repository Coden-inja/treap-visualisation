//codeExamples.ts
import { CodeExample } from '@/components/shared/CodeSnippets';

export const treapCodeExamples: CodeExample[] = [
//   {
//     language: 'TypeScript',
//     icon: '📘',
//     code: `class TreapNode {
//   key: number;
//   priority: number;
//   left: TreapNode | null = null;
//   right: TreapNode | null = null;

//   constructor(key: number) {
//     this.key = key;
//     this.priority = Math.random() * 100;
//   }
// }

// class Treap {
//   root: TreapNode | null = null;

//   // Right rotation
//   private rotateRight(node: TreapNode): TreapNode {
//     const left = node.left!;
//     node.left = left.right;
//     left.right = node;
//     return left;
//   }

//   // Left rotation
//   private rotateLeft(node: TreapNode): TreapNode {
//     const right = node.right!;
//     node.right = right.left;
//     right.left = node;
//     return right;
//   }

//   // Insert with rotations to maintain heap property
//   private insertNode(node: TreapNode | null, key: number): TreapNode {
//     if (!node) return new TreapNode(key);

//     if (key < node.key) {
//       node.left = this.insertNode(node.left, key);
//       // Fix heap property
//       if (node.left.priority > node.priority) {
//         node = this.rotateRight(node);
//       }
//     } else {
//       node.right = this.insertNode(node.right, key);
//       // Fix heap property
//       if (node.right.priority > node.priority) {
//         node = this.rotateLeft(node);
//       }
//     }
//     return node;
//   }

//   insert(key: number): void {
//     this.root = this.insertNode(this.root, key);
//   }

//   // Search (standard BST search)
//   search(key: number): TreapNode | null {
//     let current = this.root;
//     while (current) {
//       if (key === current.key) return current;
//       current = key < current.key ? current.left : current.right;
//     }
//     return null;
//   }
// }

// // Usage
// const treap = new Treap();
// treap.insert(50);
// treap.insert(30);
// treap.insert(70);
// console.log(treap.search(30)); // Found!`
//   },
{
    language: 'C', // <--- Changed
    icon: '⚙️', // <--- Changed (optional)
    code: `#include <stdio.h>
#include <stdlib.h>
#include <time.h>

typedef struct TreapNode {
    int key;
    int priority;
    struct TreapNode *left;
    struct TreapNode *right;
} TreapNode;

// Function to create a new node
TreapNode* createNode(int key) {
    TreapNode* node = (TreapNode*)malloc(sizeof(TreapNode));
    node->key = key;
    node->priority = rand() % 100;
    node->left = NULL;
    node->right = NULL;
    return node;
}

// Right rotation
TreapNode* rotateRight(TreapNode* node) {
    TreapNode* left = node->left;
    node->left = left->right;
    left->right = node;
    return left;
}

// Left rotation
TreapNode* rotateLeft(TreapNode* node) {
    TreapNode* right = node->right;
    node->right = right->left;
    right->left = node;
    return right;
}

// Insert with rotations
TreapNode* insertNode(TreapNode* node, int key) {
    if (!node) return createNode(key);

    if (key < node->key) {
        node->left = insertNode(node->left, key);
        // Fix heap property
        if (node->left->priority > node->priority)
            node = rotateRight(node);
    } else {
        node->right = insertNode(node->right, key);
        // Fix heap property
        if (node->right->priority > node->priority)
            node = rotateLeft(node);
    }
    return node;
}

// Search (standard BST search)
TreapNode* search(TreapNode* root, int key) {
    TreapNode* current = root;
    while (current) {
        if (key == current->key) return current;
        current = key < current->key ? current->left : current->right;
    }
    return NULL;
}

int main() {
    srand(time(NULL));
    TreapNode* root = NULL;

    root = insertNode(root, 50);
    root = insertNode(root, 30);
    root = insertNode(root, 70);

    TreapNode* found = search(root, 30);
    printf(found ? "Found!\\n" : "Not found\\n");

    // Remember to free memory in a real application
    return 0;
}`
  },
  {
    language: 'Python',
    icon: '🐍',
    code: `import random

class TreapNode:
    def __init__(self, key):
        self.key = key
        self.priority = random.randint(1, 100)
        self.left = None
        self.right = None

class Treap:
    def __init__(self):
        self.root = None
    
    def rotate_right(self, node):
        left = node.left
        node.left = left.right
        left.right = node
        return left
    
    def rotate_left(self, node):
        right = node.right
        node.right = right.left
        right.left = node
        return right
    
    def insert_node(self, node, key):
        if not node:
            return TreapNode(key)
        
        if key < node.key:
            node.left = self.insert_node(node.left, key)
            # Fix heap property
            if node.left.priority > node.priority:
                node = self.rotate_right(node)
        else:
            node.right = self.insert_node(node.right, key)
            # Fix heap property
            if node.right.priority > node.priority:
                node = self.rotate_left(node)
        
        return node
    
    def insert(self, key):
        self.root = self.insert_node(self.root, key)
    
    def search(self, key):
        current = self.root
        while current:
            if key == current.key:
                return current
            current = current.left if key < current.key else current.right
        return None

# Usage
treap = Treap()
treap.insert(50)
treap.insert(30)
treap.insert(70)
print(treap.search(30))  # Found!`
  },
  {
    language: 'C++',
    icon: '⚡',
    code: `#include <iostream>
#include <cstdlib>
#include <ctime>

struct TreapNode {
    int key;
    int priority;
    TreapNode* left;
    TreapNode* right;
    
    TreapNode(int k) : key(k), left(nullptr), right(nullptr) {
        priority = rand() % 100;
    }
};

class Treap {
private:
    TreapNode* root;
    
    TreapNode* rotateRight(TreapNode* node) {
        TreapNode* left = node->left;
        node->left = left->right;
        left->right = node;
        return left;
    }
    
    TreapNode* rotateLeft(TreapNode* node) {
        TreapNode* right = node->right;
        node->right = right->left;
        right->left = node;
        return right;
    }
    
    TreapNode* insertNode(TreapNode* node, int key) {
        if (!node) return new TreapNode(key);
        
        if (key < node->key) {
            node->left = insertNode(node->left, key);
            // Fix heap property
            if (node->left->priority > node->priority)
                node = rotateRight(node);
        } else {
            node->right = insertNode(node->right, key);
            // Fix heap property
            if (node->right->priority > node->priority)
                node = rotateLeft(node);
        }
        return node;
    }
    
public:
    Treap() : root(nullptr) {
        srand(time(nullptr));
    }
    
    void insert(int key) {
        root = insertNode(root, key);
    }
    
    TreapNode* search(int key) {
        TreapNode* current = root;
        while (current) {
            if (key == current->key) return current;
            current = key < current->key ? current->left : current->right;
        }
        return nullptr;
    }
};

int main() {
    Treap treap;
    treap.insert(50);
    treap.insert(30);
    treap.insert(70);
    
    TreapNode* found = treap.search(30);
    std::cout << (found ? "Found!" : "Not found") << std::endl;
    
    return 0;
}`
  },
//   {
//     language: 'Java',
//     icon: '☕',
//     code: `import java.util.Random;

// class TreapNode {
//     int key;
//     int priority;
//     TreapNode left, right;
    
//     public TreapNode(int key) {
//         this.key = key;
//         this.priority = new Random().nextInt(100);
//         this.left = null;
//         this.right = null;
//     }
// }

// public class Treap {
//     private TreapNode root;
    
//     private TreapNode rotateRight(TreapNode node) {
//         TreapNode left = node.left;
//         node.left = left.right;
//         left.right = node;
//         return left;
//     }
    
//     private TreapNode rotateLeft(TreapNode node) {
//         TreapNode right = node.right;
//         node.right = right.left;
//         right.left = node;
//         return right;
//     }
    
//     private TreapNode insertNode(TreapNode node, int key) {
//         if (node == null) return new TreapNode(key);
        
//         if (key < node.key) {
//             node.left = insertNode(node.left, key);
//             // Fix heap property
//             if (node.left.priority > node.priority)
//                 node = rotateRight(node);
//         } else {
//             node.right = insertNode(node.right, key);
//             // Fix heap property
//             if (node.right.priority > node.priority)
//                 node = rotateLeft(node);
//         }
//         return node;
//     }
    
//     public void insert(int key) {
//         root = insertNode(root, key);
//     }
    
//     public TreapNode search(int key) {
//         TreapNode current = root;
//         while (current != null) {
//             if (key == current.key) return current;
//             current = key < current.key ? current.left : current.right;
//         }
//         return null;
//     }
    
//     public static void main(String[] args) {
//         Treap treap = new Treap();
//         treap.insert(50);
//         treap.insert(30);
//         treap.insert(70);
        
//         TreapNode found = treap.search(30);
//         System.out.println(found != null ? "Found!" : "Not found");
//     }
// }`
//   }
];
