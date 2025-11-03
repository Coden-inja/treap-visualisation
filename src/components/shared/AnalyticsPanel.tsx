import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart3, Clock, Activity, TrendingUp } from 'lucide-react';

export interface Operation {
  id: string;
  type: string;
  timestamp: number;
  complexity: string;
  value?: any;
  duration?: number;
}

interface AnalyticsPanelProps {
  operations: Operation[];
  totalOperations?: number;
  averageTime?: number;
}

export const AnalyticsPanel = ({ 
  operations, 
  totalOperations = 0,
  averageTime = 0 
}: AnalyticsPanelProps) => {
  const getComplexityColor = (complexity: string) => {
    if (complexity.includes('1')) return 'bg-primary/20 text-primary';
    if (complexity.includes('log')) return 'bg-secondary/20 text-secondary';
    if (complexity.includes('n²')) return 'bg-accent/20 text-accent';
    return 'bg-muted';
  };

  const operationCounts = operations.reduce((acc, op) => {
    acc[op.type] = (acc[op.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostFrequent = Object.entries(operationCounts)
    .sort((a, b) => b[1] - a[1])[0];

  return (
    <Card className="glass border-primary/20 w-80 flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Analytics</CardTitle>
        </div>
        <CardDescription>Performance metrics and operation tracking</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-primary/20 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-primary" />
              <div className="text-xs text-muted-foreground">Total Ops</div>
            </div>
            <div className="text-2xl font-bold">{totalOperations}</div>
          </Card>

          <Card className="border-primary/20 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-secondary" />
              <div className="text-xs text-muted-foreground">Avg Time</div>
            </div>
            <div className="text-2xl font-bold">{averageTime.toFixed(1)}ms</div>
          </Card>
        </div>

        {/* Most Frequent Operation */}
        {mostFrequent && (
          <Card className="border-accent/20 bg-accent/5 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <div className="text-xs font-semibold text-accent">Most Used</div>
              </div>
              <Badge variant="secondary" className="bg-accent/20 text-accent">
                {mostFrequent[1]}x
              </Badge>
            </div>
            <div className="text-sm mt-1">{mostFrequent[0]}</div>
          </Card>
        )}

        {/* Operation History */}
        <div className="flex-1 flex flex-col min-h-0">
          <h3 className="text-sm font-semibold mb-2 text-primary">Operation History</h3>
          <ScrollArea className="flex-1 rounded-lg border border-primary/20 bg-card/50">
            <div className="p-3 space-y-2">
              {operations.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No operations yet
                </p>
              ) : (
                operations.slice().reverse().map((op, idx) => (
                  <Card key={op.id || idx} className="border-primary/20 p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">{op.type}</span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getComplexityColor(op.complexity)}`}
                      >
                        {op.complexity}
                      </Badge>
                    </div>
                    {op.value !== undefined && (
                      <div className="text-xs text-muted-foreground">
                        Value: {op.value}
                      </div>
                    )}
                    {op.duration && (
                      <div className="text-xs text-muted-foreground">
                        Time: {op.duration}ms
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(op.timestamp).toLocaleTimeString()}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Complexity Legend */}
        <Card className="border-primary/20 p-3">
          <h4 className="text-xs font-semibold mb-2 text-muted-foreground">
            Time Complexity Reference
          </h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <Badge className="bg-primary/20 text-primary">O(1)</Badge>
              <span className="text-muted-foreground">Constant</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Badge className="bg-secondary/20 text-secondary">O(log n)</Badge>
              <span className="text-muted-foreground">Logarithmic</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Badge className="bg-muted">O(n)</Badge>
              <span className="text-muted-foreground">Linear</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Badge className="bg-accent/20 text-accent">O(n²)</Badge>
              <span className="text-muted-foreground">Quadratic</span>
            </div>
          </div>
        </Card>
      </CardContent>
    </Card>
  );
};
