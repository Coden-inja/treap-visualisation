import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Treap, TreapOperation } from './treap';
import { Plus, Trash2, Search, RotateCw, Shuffle } from 'lucide-react';
import { toast } from 'sonner';

interface ControlPanelProps {
  treap: Treap;
  onOperation: () => void;
  onHighlight: (key: number | null) => void;
}

export const ControlPanel = ({ treap, onOperation, onHighlight }: ControlPanelProps) => {
  const [insertKey, setInsertKey] = useState('');
  const [insertPriority, setInsertPriority] = useState('');
  const [deleteKey, setDeleteKey] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'levelorder'>('inorder');

  const handleInsert = () => {
    const key = parseInt(insertKey);
    const priority = insertPriority ? parseInt(insertPriority) : undefined;

    if (isNaN(key)) {
      toast.error('Please enter a valid key');
      return;
    }

    if (insertPriority && isNaN(priority!)) {
      toast.error('Please enter a valid priority');
      return;
    }

    treap.insert(key, priority);
    onOperation();
    onHighlight(key);
    
    toast.success(`Inserted ${key}${priority !== undefined ? ` with priority ${priority}` : ''}`, {
      description: 'Node added to Treap',
    });

    setInsertKey('');
    setInsertPriority('');

    // Clear highlight after animation
    setTimeout(() => onHighlight(null), 2000);
  };

  const handleDelete = () => {
    const key = parseInt(deleteKey);

    if (isNaN(key)) {
      toast.error('Please enter a valid key');
      return;
    }

    const existed = treap.search(key);
    treap.delete(key);
    onOperation();

    if (existed) {
      toast.success(`Deleted ${key}`, {
        description: 'Node removed from Treap',
      });
    } else {
      toast.warning(`Key ${key} not found`, {
        description: 'No node to delete',
      });
    }

    setDeleteKey('');
  };

  const handleSearch = () => {
    const key = parseInt(searchKey);

    if (isNaN(key)) {
      toast.error('Please enter a valid key');
      return;
    }

    const found = treap.search(key);
    onHighlight(key);

    if (found) {
      toast.success(`Found ${key}!`, {
        description: 'Key exists in Treap',
      });
    } else {
      toast.error(`Key ${key} not found`, {
        description: 'Key does not exist in Treap',
      });
    }

    setSearchKey('');

    // Clear highlight after animation
    setTimeout(() => onHighlight(null), 2000);
  };

  const handleTraversal = (type: 'inorder' | 'preorder' | 'levelorder') => {
    let result: number[] = [];
    
    switch (type) {
      case 'inorder':
        result = treap.inorder();
        break;
      case 'preorder':
        result = treap.preorder();
        break;
      case 'levelorder':
        result = treap.levelorder();
        break;
    }

    setTraversalType(type);
    setTraversalResult(result);
    
    toast.info(`${type.charAt(0).toUpperCase() + type.slice(1)} Traversal`, {
      description: `Result: [${result.join(', ')}]`,
    });
  };

  const handleRandomInsert = () => {
    const key = Math.floor(Math.random() * 100);
    const priority = Math.floor(Math.random() * 100);
    
    treap.insert(key, priority);
    onOperation();
    onHighlight(key);
    
    toast.success(`Random insert: ${key} (priority: ${priority})`);

    setTimeout(() => onHighlight(null), 2000);
  };

  const recentOps = treap.getRecentOperations(5);

  return (
    <Card className="w-96 p-6 space-y-6 glass border-primary/20 h-full overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-glow mb-2">Control Panel</h2>
        <p className="text-sm text-muted-foreground">Manage Treap operations</p>
      </div>

      <Separator className="bg-primary/20" />

      {/* Insert Operation */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-primary">Insert Node</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="number"
              placeholder="Key"
              value={insertKey}
              onChange={(e) => setInsertKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
              className="bg-card/50 border-primary/20"
            />
          </div>
          <div className="flex-1">
            <Input
              type="number"
              placeholder="Priority (auto)"
              value={insertPriority}
              onChange={(e) => setInsertPriority(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
              className="bg-card/50 border-primary/20"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleInsert} className="flex-1 glow-primary">
            <Plus className="mr-2 h-4 w-4" />
            Insert
          </Button>
          <Button onClick={handleRandomInsert} variant="outline" className="border-primary/20">
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator className="bg-primary/20" />

      {/* Delete Operation */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-secondary">Delete Node</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Key to delete"
            value={deleteKey}
            onChange={(e) => setDeleteKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
            className="flex-1 bg-card/50 border-secondary/20"
          />
          <Button onClick={handleDelete} variant="secondary" className="glow-secondary">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator className="bg-primary/20" />

      {/* Search Operation */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-accent">Search Key</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Key to search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-card/50 border-accent/20"
          />
          <Button onClick={handleSearch} variant="outline" className="border-accent glow-accent">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator className="bg-primary/20" />

      {/* Traversals */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Traversals</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => handleTraversal('inorder')}
            variant="outline"
            size="sm"
            className="border-primary/20"
          >
            Inorder
          </Button>
          <Button
            onClick={() => handleTraversal('preorder')}
            variant="outline"
            size="sm"
            className="border-primary/20"
          >
            Preorder
          </Button>
          <Button
            onClick={() => handleTraversal('levelorder')}
            variant="outline"
            size="sm"
            className="border-primary/20"
          >
            Level
          </Button>
        </div>
        
        {traversalResult.length > 0 && (
          <div className="p-3 bg-card/30 rounded-lg border border-primary/10">
            <div className="text-xs text-muted-foreground mb-1">
              {traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} Result:
            </div>
            <div className="flex flex-wrap gap-1">
              {traversalResult.map((key, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {key}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator className="bg-primary/20" />

      {/* Recent Operations */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Recent Operations</Label>
        <div className="space-y-2">
          {recentOps.length === 0 ? (
            <p className="text-xs text-muted-foreground">No operations yet</p>
          ) : (
            recentOps.reverse().map((op, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-xs p-2 bg-card/20 rounded border border-primary/10"
              >
                <RotateCw className="h-3 w-3 text-primary" />
                <span className="text-muted-foreground">
                  {op.type === 'insert' && `Inserted ${op.key}${op.priority ? ` (p:${op.priority})` : ''}`}
                  {op.type === 'delete' && `Deleted ${op.key}`}
                  {op.type === 'search' && `Searched ${op.key} - ${op.found ? 'Found' : 'Not found'}`}
                  {(op.type === 'rotate-left' || op.type === 'rotate-right') && `${op.type}`}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};
