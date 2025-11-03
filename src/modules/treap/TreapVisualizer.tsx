import { useEffect, useRef, useState } from 'react';
import { Treap } from './treap';
import { calculateTreeLayout, getPriorityColor, getPriorityGlow, LayoutNode, TreeEdge } from './treeLayout';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface Transform {
  x: number;
  y: number;
  scale: number;
}

interface TreapVisualizerProps {
  treap: Treap;
  highlightedKey?: number | null;
}

export const TreapVisualizer = ({ treap, highlightedKey }: TreapVisualizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [layout, setLayout] = useState<{ nodes: LayoutNode[]; edges: TreeEdge[] }>({ nodes: [], edges: [] });
  const [transform, setTransform] = useState<Transform>({ x: dimensions.width / 2, y: dimensions.height / 2, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [previousPositions] = useState(new Map<string, { x: number; y: number }>());

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const newDimensions = { width, height: Math.max(height, 600) };
        setDimensions(newDimensions);
        // Update transform to maintain center position on resize
        setTransform(prev => ({
          ...prev,
          x: newDimensions.width / 2,
          y: newDimensions.height / 2
        }));
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Ensure transform is updated when dimensions change
  useEffect(() => {
    setTransform(prev => ({
      ...prev,
      x: dimensions.width / 2,
      y: dimensions.height / 2
    }));
  }, [dimensions]);

  // Mouse and touch event handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setTransform(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = transform.scale * scaleChange;

    if (newScale >= 0.1 && newScale <= 3) {
      // Calculate mouse position relative to SVG
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (!svgRect) return;

      const mouseX = e.clientX - svgRect.left;
      const mouseY = e.clientY - svgRect.top;

      // Calculate new position to zoom towards mouse
      const newX = mouseX - (mouseX - transform.x) * scaleChange;
      const newY = mouseY - (mouseY - transform.y) * scaleChange;

      setTransform(prev => ({
        x: newX,
        y: newY,
        scale: newScale
      }));
    }
  };

  // Calculate layout when treap changes
  useEffect(() => {
    const newLayout = calculateTreeLayout(treap.root, dimensions.width, dimensions.height);
    
    // Store current positions for animation
    layout.nodes.forEach(node => {
      previousPositions.set(node.node.id, { x: node.x, y: node.y });
    });
    
    setLayout(newLayout);
  }, [treap.root, dimensions]);

  return (
    <Card 
      ref={containerRef} 
      className="flex-1 overflow-hidden glass border-primary/20 relative cursor-grab active:cursor-grabbing"
      style={{ minHeight: '600px' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <svg 
        ref={svgRef}
        width={dimensions.width} 
        height={dimensions.height} 
        className="w-full h-full"
        style={{ minHeight: '600px' }}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      >
        <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.scale})`}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3, 0 6"
              fill="hsl(var(--primary) / 0.3)"
            />
          </marker>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path 
              d="M 40 0 L 0 0 0 40" 
              fill="none" 
              stroke="hsl(var(--primary) / 0.05)" 
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect 
          width="100%" 
          height="100%" 
          fill="url(#grid)" 
          className="opacity-30"
        />

        {layout.nodes.length === 0 && (
          <g className="empty-state">
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              className="text-muted-foreground fill-current opacity-50 text-lg"
              dy="-1em"
            >
              Empty Treap
            </text>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              className="text-muted-foreground fill-current opacity-30 text-sm"
              dy="1em"
            >
              Insert nodes to visualize the structure
            </text>
          </g>
        )}

        <g className="edges">
          {layout.edges.map((edge, index) => (
            <motion.line
              key={`edge-${index}`}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                x1: edge.from.x,
                y1: edge.from.y,
                x2: edge.to.x,
                y2: edge.to.y
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              stroke="hsl(var(--primary) / 0.3)"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
          ))}
        </g>

        <g className="nodes">
          {layout.nodes.map((layoutNode) => {
            const isHighlighted = layoutNode.node.key === highlightedKey;
            const color = getPriorityColor(layoutNode.node.priority);
            const glowColor = getPriorityGlow(layoutNode.node.priority);
            
            return (
              <motion.g
                key={layoutNode.node.id}
                initial={{ 
                  scale: 0,
                  opacity: 0,
                  x: previousPositions.get(layoutNode.node.id)?.x ?? layoutNode.x,
                  y: previousPositions.get(layoutNode.node.id)?.y ?? layoutNode.y
                }}
                animate={{ 
                  scale: 1,
                  opacity: 1,
                  x: layoutNode.x,
                  y: layoutNode.y
                }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  duration: previousPositions.has(layoutNode.node.id) ? 0.3 : 0
                }}
              >
                {isHighlighted && (
                  <circle
                    r="32"
                    fill={color}
                    opacity="0.2"
                    filter="url(#glow)"
                    className="animate-pulse-slow"
                  />
                )}

                <circle
                  r="28"
                  fill={color}
                  stroke={isHighlighted ? 'hsl(var(--accent))' : 'hsl(var(--foreground) / 0.2)'}
                  strokeWidth={isHighlighted ? '3' : '2'}
                  className="transition-all duration-300"
                />

                <text
                  y="-5"
                  textAnchor="middle"
                  className="fill-background font-bold text-lg select-none"
                >
                  {layoutNode.node.key}
                </text>

                <text
                  y="12"
                  textAnchor="middle"
                  className="fill-background text-xs opacity-80 select-none"
                >
                  {layoutNode.node.priority.toFixed(1)}
                </text>
              </motion.g>
            );
          })}
        </g>
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass rounded-lg p-3 space-y-2">
        <div className="text-xs font-semibold text-foreground/70 mb-2">Priority Scale</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--priority-low))' }} />
          <span className="text-xs text-muted-foreground">Low (0-20)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--priority-mid))' }} />
          <span className="text-xs text-muted-foreground">Medium (40-60)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--priority-high))' }} />
          <span className="text-xs text-muted-foreground">High (80-100)</span>
        </div>
      </div>
    </Card>
  );
};