# DSA Playground 🚀

**Interactive Data Structures & Algorithms Learning Platform**

A futuristic, modular web application for visualizing and learning data structures and algorithms. Built with React, TypeScript, and a cyberpunk-inspired design system.

---

## 🌟 Features

### Current Modules
- **Treap** ✅ (BST + Heap hybrid with priority-based balancing)
  - Insert, Delete, Search operations
  - Traversals: Inorder, Preorder, Level-order
  - Real-time animated visualizations
  - Task Scheduler scenario demo

### Coming Soon
- **AVL Tree** 🔜 (Self-balancing BST)
- **Graph** 🔜 (BFS/DFS visualizations)
- **Heap** 🔜 (Min/Max priority queues)
- **Stack & Queue** 🔜 (Linear data structures)

---

## 🏗️ Architecture

### Modular Design
Each data structure is a self-contained module with its own logic, visualizer, and controls:

```
src/
├── modules/
│   └── treap/
│       ├── treap.ts              # Core Treap logic
│       ├── treeLayout.ts         # Layout & visualization utilities
│       ├── TreapVisualizer.tsx   # SVG visualization component
│       ├── ControlPanel.tsx      # Operation controls
│       └── ScenarioDemo.tsx      # Real-world scenario demo
├── pages/
│   ├── Dashboard.tsx             # Main landing page with module cards
│   ├── TreapModule.tsx           # Treap module wrapper
│   └── NotFound.tsx              # 404 page
├── components/ui/                # Reusable UI components (shadcn)
└── index.css                     # Design system tokens
```

### Adding New Data Structures

To add a new data structure module:

1. **Create Module Directory**: `src/modules/[structure-name]/`
2. **Implement Core Logic**: Create `[structure].ts` with operations
3. **Build Visualizer**: Create `[Structure]Visualizer.tsx` using shared layout utilities
4. **Add Controls**: Create `ControlPanel.tsx` for user operations
5. **Create Page Wrapper**: Add `[Structure]Module.tsx` in `src/pages/`
6. **Update Routing**: Add route in `src/App.tsx`
7. **Update Dashboard**: Add module card in `src/pages/Dashboard.tsx`

Example structure for a new Stack module:
```
src/modules/stack/
├── stack.ts                 # Stack operations (push, pop, peek)
├── StackVisualizer.tsx      # Vertical visualization
├── ControlPanel.tsx         # Push/Pop controls
└── scenarios/               # Real-world scenarios (optional)
```

---

## 🎨 Design System

### Color Tokens (HSL)
- **Primary**: Electric Cyan (`hsl(184 100% 50%)`)
- **Secondary**: Neon Purple (`hsl(267 100% 62%)`)
- **Accent**: Hot Pink (`hsl(320 100% 58%)`)
- **Background**: Deep Space (`hsl(229 40% 8%)`)

### Priority Gradients (for visualizations)
- **Low**: Cool Blue (`hsl(200 100% 50%)`)
- **Mid**: Purple/Pink blend
- **High**: Red (`hsl(0 100% 60%)`)

### Animations
- `animate-pulse-glow`: Pulsing glow effect
- `animate-node-insert`: Node insertion animation
- `animate-slide-up`: Upward slide transition
- `glass`: Glassmorphism effect

All colors use CSS custom properties defined in `src/index.css`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

---

## 🎯 Roadmap

### Phase 1: Core Structures ✅
- [x] Treap with visualizer
- [x] Modular architecture
- [x] Dashboard landing page
- [x] Routing system

### Phase 2: Additional Structures 🔜
- [ ] AVL Tree
- [ ] Heap (Min/Max)
- [ ] Graph (adjacency list/matrix)
- [ ] Stack & Queue

### Phase 3: Enhanced Features 🔮
- [ ] **Learn Mode**: Step-by-step explanations with pseudocode
- [ ] **Play Mode**: Interactive challenges and mini-games
- [ ] **Analytics Panel**: Time complexity tracking, operation counts
- [ ] **Code Snippets**: Multi-language code display (C++, Java, Python)
- [ ] **Export**: GIF/Video generation of visualizations
- [ ] **Collaborative Mode**: Real-time WebSocket-based shared sessions

---

## 🧪 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + CSS Custom Properties
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router v6
- **State Management**: React hooks (local state)
- **Animations**: Tailwind CSS animations + SVG transitions

---

## 📚 Educational Goals

This platform aims to:
1. **Demystify DSA**: Make complex structures intuitive through visualization
2. **Interactive Learning**: Hands-on operations, not passive reading
3. **Real-World Context**: Scenario demos (task schedulers, priority queues, etc.)
4. **Aesthetic Engagement**: Beautiful UI to maintain interest and focus
5. **Extensibility**: Easy to add new structures for professors/educators

---

## 🤝 Contributing

To contribute:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-structure`
3. Follow the module creation guidelines above
4. Maintain the cyberpunk design aesthetic
5. Submit a pull request

---

## 📄 License

MIT License - feel free to use this for educational purposes!

---

## 🌌 Vision

**"Cyberpunk Academia meets Interactive Textbook"**

Transform DSA learning from intimidating to inspiring. Make every operation feel like you're inside a futuristic computer-science laboratory from 2077. Keep it breathtaking, practical, and endlessly extensible.

---

**Built with ❤️ and neon glows**

---

## Project info

**Lovable Project URL**: https://lovable.dev/projects/fc6f3e4b-2f49-4ea5-86e5-104649f0464a

## Deployment

Simply open [Lovable](https://lovable.dev/projects/fc6f3e4b-2f49-4ea5-86e5-104649f0464a) and click on Share -> Publish.
