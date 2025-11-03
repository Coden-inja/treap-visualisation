import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Treap } from '@/modules/treap/treap';
import { TreapVisualizer } from '@/modules/treap/TreapVisualizer';
import { ControlPanel } from '@/modules/treap/ControlPanel';
import { Button } from '@/components/ui/button';
import { Info, Home } from 'lucide-react';
import { toast } from 'sonner';

const TreapModule = () => {
  const navigate = useNavigate();
  const [treap] = useState(() => new Treap());
  const [refreshKey, setRefreshKey] = useState(0);
  const [highlightedKey, setHighlightedKey] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(true);

  const handleOperation = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleClearAll = () => {
    treap.root = null;
    handleOperation();
    toast.success('Treap cleared');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background effect */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="border-b border-primary/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="border-primary/20"
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div className="h-6 w-px bg-primary/20" />
              <div>
                <h1 className="text-3xl font-bold text-glow">Treap Visualizer</h1>
                <p className="text-sm text-muted-foreground">Binary Search Tree + Heap Hybrid</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInfo(!showInfo)}
                className="border-primary/20"
              >
                <Info className="h-4 w-4 mr-2" />
                {showInfo ? 'Hide' : 'Show'} Info
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      {showInfo && (
        <div className="border-b border-accent/20 bg-card/30 backdrop-blur-sm animate-slide-up">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-accent">What is a Treap?</p>
                <p className="text-xs text-muted-foreground">
                  A Treap is a hybrid data structure combining Binary Search Tree (BST) and Heap properties. 
                  Nodes maintain BST order by key (left &lt; parent &lt; right) and Max-Heap order by priority (parent &gt; children). 
                  This ensures balanced structure through random priorities, achieving O(log n) operations on average.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 h-[calc(100vh-120px)]">
        <div className="flex gap-4 items-stretch h-full">
          <div className="w-96">
            <ControlPanel
              treap={treap}
              onOperation={handleOperation}
              onHighlight={setHighlightedKey}
            />
          </div>
          <div className="flex-1 h-full">
            <TreapVisualizer
              key={refreshKey}
              treap={treap}
              highlightedKey={highlightedKey}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TreapModule;
