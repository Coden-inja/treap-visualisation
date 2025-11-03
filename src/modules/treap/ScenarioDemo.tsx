import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Treap } from './treap';
import { Calendar, Clock, Zap, Play } from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: number;
  name: string;
  priority: number;
  deadline: string;
  duration: string;
}

interface ScenarioDemoProps {
  treap: Treap;
  onOperation: () => void;
  onHighlight: (key: number | null) => void;
}

const sampleTasks: Task[] = [
  { id: 45, name: 'Fix Critical Bug', priority: 95, deadline: 'Today 5 PM', duration: '2h' },
  { id: 32, name: 'Code Review', priority: 70, deadline: 'Tomorrow', duration: '1h' },
  { id: 78, name: 'Deploy to Production', priority: 88, deadline: 'Today EOD', duration: '30m' },
  { id: 12, name: 'Team Meeting', priority: 50, deadline: 'Tomorrow 10 AM', duration: '1h' },
  { id: 56, name: 'Write Documentation', priority: 35, deadline: 'This Week', duration: '3h' },
  { id: 89, name: 'Security Patch', priority: 92, deadline: 'Urgent', duration: '1.5h' },
];

export const ScenarioDemo = ({ treap, onOperation, onHighlight }: ScenarioDemoProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  const runDemo = async () => {
    setIsRunning(true);
    toast.info('Starting Task Scheduler Demo', {
      description: 'Watch how Treap manages task priorities!',
    });

    for (let i = 0; i < sampleTasks.length; i++) {
      const task = sampleTasks[i];
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      treap.insert(task.id, task.priority);
      onOperation();
      onHighlight(task.id);
      setCurrentTaskIndex(i);
      
      toast.success(`Added: ${task.name}`, {
        description: `Priority: ${task.priority} | ${task.deadline}`,
      });

      await new Promise(resolve => setTimeout(resolve, 500));
      onHighlight(null);
    }

    setIsRunning(false);
    toast.success('Demo Complete!', {
      description: 'All tasks loaded into the scheduler',
    });
  };

  const processNextTask = () => {
    if (!treap.root) {
      toast.warning('No tasks in queue');
      return;
    }

    // Get inorder traversal to find task with highest priority (root)
    const rootKey = treap.root.key;
    const task = sampleTasks.find(t => t.id === rootKey);

    if (task) {
      toast.info(`Processing: ${task.name}`, {
        description: `Estimated time: ${task.duration}`,
      });
      
      onHighlight(rootKey);
      
      setTimeout(() => {
        treap.delete(rootKey);
        onOperation();
        onHighlight(null);
        
        toast.success(`Completed: ${task.name}`);
      }, 1500);
    }
  };

  return (
    <Card className="p-6 space-y-6 glass border-accent/20">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-glow mb-2">
            <Zap className="inline-block mr-2 h-6 w-6 text-accent" />
            Task Scheduler Demo
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-world application: Priority-based task scheduling using Treap
          </p>
        </div>
        <Button
          onClick={runDemo}
          disabled={isRunning}
          className="glow-accent"
        >
          <Play className="mr-2 h-4 w-4" />
          {isRunning ? 'Running...' : 'Run Demo'}
        </Button>
      </div>

      <Separator className="bg-accent/20" />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Tasks Queue</h3>
          <Button
            onClick={processNextTask}
            size="sm"
            variant="outline"
            className="border-accent/20"
            disabled={!treap.root}
          >
            Process Next Task
          </Button>
        </div>

        <div className="grid gap-2 max-h-96 overflow-y-auto">
          {sampleTasks.map((task, index) => {
            const isActive = isRunning && index === currentTaskIndex;
            const isInTree = treap.search(task.id);

            return (
              <div
                key={task.id}
                className={`p-3 rounded-lg border transition-all duration-300 ${
                  isActive
                    ? 'border-accent bg-accent/10 animate-pulse-glow'
                    : isInTree
                    ? 'border-primary/20 bg-card/50'
                    : 'border-muted/20 bg-muted/10 opacity-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{task.name}</span>
                      {isInTree && (
                        <Badge variant="secondary" className="text-xs">
                          In Queue
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {task.deadline}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.duration}
                      </span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge
                      variant="outline"
                      className="text-xs border-primary"
                      style={{
                        borderColor: `hsl(${(task.priority / 100) * 120}, 70%, 50%)`,
                        color: `hsl(${(task.priority / 100) * 120}, 70%, 50%)`,
                      }}
                    >
                      P: {task.priority}
                    </Badge>
                    <div className="text-xs text-muted-foreground">ID: {task.id}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Separator className="bg-accent/20" />

      <div className="p-4 bg-card/30 rounded-lg border border-accent/10 space-y-2">
        <h4 className="text-xs font-semibold text-accent">How It Works</h4>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>Each task has a unique ID (key) and priority value</li>
          <li>Treap maintains BST order by ID and heap order by priority</li>
          <li>Highest priority task is always accessible in O(log n) time</li>
          <li>Dynamic insertions and deletions handle real-time task updates</li>
          <li>Rotations automatically maintain optimal structure</li>
        </ul>
      </div>
    </Card>
  );
};
