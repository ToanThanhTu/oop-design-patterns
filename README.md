# OOP Design Patterns -- Learn by Building Full-Stack Apps

Master OOP fundamentals, SOLID principles, and all 23 GoF design patterns by building 7 progressively complex full-stack TypeScript applications. Each app is a real product where patterns emerge naturally from the domain -- not contrived textbook examples.

## What's Inside

- **6 OOP fundamentals** -- Class, Objects, Abstraction, Encapsulation, Inheritance, Polymorphism
- **5 SOLID principles** -- SRP, OCP, LSP, ISP, DIP
- **23 design patterns** -- every Creational, Structural, and Behavioral pattern from the Gang of Four
- **7 full-stack apps** -- React/Vanilla TS frontends, Express/NestJS backends, PostgreSQL/MongoDB/SQLite/Redis databases

## Learning Roadmap

```
App 1  TaskFlow       ██░░░░░░░░  Beginner        Express + SQLite
App 2  LogStream      ███░░░░░░░  Beginner+       Express + MongoDB
App 3  PayGate        █████░░░░░  Intermediate    NestJS + PostgreSQL
App 4  NotifyHub      ██████░░░░  Intermediate+   NestJS + PostgreSQL + Redis
App 5  DocEditor      ████████░░  Advanced        Express + PostgreSQL
App 6  CloudVault     ████████░░  Advanced        NestJS + PostgreSQL + Redis
App 7  ChatMesh       ██████████  Capstone        NestJS + PostgreSQL + Redis
```

## The Apps

### App 1: TaskFlow -- Task Management Board

A Kanban-style task board with cloneable templates, undo/redo, and filtered iteration across columns.

| | |
|---|---|
| **Stack** | React (Vite) + Express.js + SQLite |
| **OOP** | Class, Objects, Encapsulation, Abstraction |
| **SOLID** | SRP, OCP |
| **Patterns** | Prototype, Memento, Iterator |

- Clone tasks from templates via deep copy (Prototype)
- Save and restore board snapshots for undo/redo (Memento)
- Traverse tasks across columns with filter predicates (Iterator)

### App 2: LogStream -- Logging & Monitoring Dashboard

A centralized logging service with a processing pipeline, real-time dashboard via WebSocket, and configurable alert thresholds.

| | |
|---|---|
| **Stack** | React (Vite) + Express.js + MongoDB |
| **OOP** | Inheritance, Polymorphism |
| **SOLID** | OCP, LSP |
| **Patterns** | Chain of Responsibility, Singleton, Observer |

- Log entries flow through a handler chain: validate, enrich, filter, store, alert (Chain of Responsibility)
- Single global logger pipeline configuration (Singleton)
- Dashboard clients subscribe to real-time log streams (Observer)

### App 3: PayGate -- Payment Processing System

A checkout system with multiple payment providers, order lifecycle management, and stackable price modifiers for tax/discount/currency.

| | |
|---|---|
| **Stack** | React (Vite) + NestJS + PostgreSQL |
| **OOP** | Abstraction, Polymorphism |
| **SOLID** | DIP, ISP, OCP |
| **Patterns** | Strategy, Factory Method, State, Decorator |

- Swap payment algorithms at runtime -- Stripe, PayPal, crypto (Strategy)
- Create provider instances via factory subclasses (Factory Method)
- Order transitions: Pending → Processing → Completed/Failed/Refunded (State)
- Stack price calculators: tax, discount, currency conversion (Decorator)

### App 4: NotifyHub -- Multi-Channel Notification System

A notification platform delivering across email, SMS, push, and in-app channels with configurable user preferences and complex message construction.

| | |
|---|---|
| **Stack** | React (Vite) + NestJS + PostgreSQL + Redis |
| **OOP** | Inheritance, Encapsulation, Polymorphism |
| **SOLID** | SRP, ISP, DIP |
| **Patterns** | Builder, Abstract Factory, Bridge, Mediator |

- Fluent notification construction with validation (Builder)
- Produce families of channel-specific objects: sender + template + tracker (Abstract Factory)
- Notification type × delivery channel varies independently (Bridge)
- Coordinate events, preferences, templates, and delivery without coupling (Mediator)

### App 5: DocEditor -- Collaborative Document Editor

A simplified document editor with stackable formatting, command-based undo/redo, multi-format export, and a custom markup language. Built with vanilla TypeScript -- no framework.

| | |
|---|---|
| **Stack** | Vanilla TypeScript + HTML/CSS + Express.js + PostgreSQL |
| **OOP** | Class, Objects, Encapsulation, Abstraction |
| **SOLID** | SRP, OCP |
| **Patterns** | Command, Composite, Visitor, Interpreter |

- Every edit is a command object with execute/undo (Command)
- Document tree: Document → Section → Paragraph → TextSpan (Composite)
- Export to HTML/Markdown via visitor traversal (Visitor)
- Parse custom markup into document nodes (Interpreter)

### App 6: CloudVault -- Virtual File System with Smart Caching

A cloud storage interface with lazy-loaded file content, access control, multiple storage backends, and shared metadata pooling.

| | |
|---|---|
| **Stack** | React (Vite) + NestJS + PostgreSQL + Redis |
| **OOP** | Inheritance, Polymorphism, Abstraction |
| **SOLID** | LSP, DIP, OCP |
| **Patterns** | Proxy, Flyweight, Adapter, Facade |

- Lazy loading, access control, and logging via file proxy (Proxy)
- Shared file type metadata across thousands of files (Flyweight)
- Wrap S3/local/FTP APIs to a common storage interface (Adapter)
- Single upload call coordinates six subsystems (Facade)

### App 7: ChatMesh -- Real-Time Chat with Bot Framework

A real-time chat application with rooms, message processing pipeline, and shared emoji instances. The capstone project reinforcing all fundamentals and SOLID principles.

| | |
|---|---|
| **Stack** | React (Vite) + WebSocket + NestJS + PostgreSQL + Redis |
| **OOP** | All six fundamentals |
| **SOLID** | All five principles |
| **Patterns** | Template Method, Flyweight |

- Message processing skeleton with overridable steps per message type (Template Method)
- Shared emoji/reaction instances from a managed pool (Flyweight)

## Coverage Matrix

Every concept is covered at least once. `✓` = primary coverage in that app.

| | TaskFlow | LogStream | PayGate | NotifyHub | DocEditor | CloudVault | ChatMesh |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **OOP Fundamentals** | | | | | | | |
| Class | ✓ | | | | ✓ | | ✓ |
| Objects | ✓ | | | | ✓ | | ✓ |
| Abstraction | ✓ | | ✓ | | ✓ | | ✓ |
| Encapsulation | ✓ | | | ✓ | ✓ | | ✓ |
| Inheritance | | ✓ | | ✓ | | ✓ | ✓ |
| Polymorphism | | ✓ | ✓ | ✓ | | ✓ | ✓ |
| **SOLID Principles** | | | | | | | |
| SRP | ✓ | | | ✓ | ✓ | | ✓ |
| OCP | ✓ | ✓ | ✓ | | ✓ | ✓ | ✓ |
| LSP | | ✓ | | | | ✓ | ✓ |
| ISP | | | ✓ | ✓ | | | ✓ |
| DIP | | | ✓ | ✓ | | ✓ | ✓ |
| **Creational Patterns** | | | | | | | |
| Prototype | ✓ | | | | | | |
| Singleton | | ✓ | | | | | |
| Factory Method | | | ✓ | | | | |
| Abstract Factory | | | | ✓ | | | |
| Builder | | | | ✓ | | | |
| **Structural Patterns** | | | | | | | |
| Decorator | | | ✓ | | | | |
| Bridge | | | | ✓ | | | |
| Composite | | | | | ✓ | | |
| Adapter | | | | | | ✓ | |
| Facade | | | | | | ✓ | |
| Flyweight | | | | | | ✓ | ✓ |
| Proxy | | | | | | ✓ | |
| **Behavioral Patterns** | | | | | | | |
| Iterator | ✓ | | | | | | |
| Memento | ✓ | | | | | | |
| Chain of Responsibility | | ✓ | | | | | |
| Observer | | ✓ | | | | | |
| Strategy | | | ✓ | | | | |
| State | | | ✓ | | | | |
| Mediator | | | | ✓ | | | |
| Command | | | | | ✓ | | |
| Composite | | | | | ✓ | | |
| Interpreter | | | | | ✓ | | |
| Visitor | | | | | ✓ | | |
| Template Method | | | | | | | ✓ |

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Language** | TypeScript (frontend + backend) |
| **Frontend** | React (Vite), Vanilla TS + HTML/CSS |
| **Backend** | Express.js, NestJS |
| **Databases** | PostgreSQL, MongoDB, SQLite, Redis |
| **Real-time** | WebSocket |

## Project Structure

```
oop-design-patterns/
├── apps/
│   ├── 01-taskflow/          # Prototype, Memento, Iterator
│   │   ├── frontend/         # React + Vite
│   │   └── backend/          # Express + SQLite
│   ├── 02-logstream/         # Chain of Responsibility, Singleton, Observer
│   │   ├── frontend/         # React + Vite
│   │   └── backend/          # Express + MongoDB
│   ├── 03-paygate/           # Strategy, Factory Method, State, Decorator
│   │   ├── frontend/         # React + Vite
│   │   └── backend/          # NestJS + PostgreSQL
│   ├── 04-notifyhub/         # Builder, Abstract Factory, Bridge, Mediator
│   │   ├── frontend/         # React + Vite
│   │   └── backend/          # NestJS + PostgreSQL + Redis
│   ├── 05-doceditor/         # Command, Composite, Visitor, Interpreter
│   │   ├── frontend/         # Vanilla TS + HTML/CSS
│   │   └── backend/          # Express + PostgreSQL
│   ├── 06-cloudvault/        # Proxy, Flyweight, Adapter, Facade
│   │   ├── frontend/         # React + Vite
│   │   └── backend/          # NestJS + PostgreSQL + Redis
│   └── 07-chatmesh/          # Template Method, Flyweight
│       ├── frontend/         # React + Vite + WebSocket
│       └── backend/          # NestJS + PostgreSQL + Redis
└── oop-expert-with-typescript.md   # Theory reference
```

## Reference

The theoretical foundation for all patterns is documented in [`oop-expert-with-typescript.md`](oop-expert-with-typescript.md), covering definitions, before/after examples, and code samples for every concept. This reference material is from [OOP Expert with TypeScript](https://github.com/jafari-dev/oop-expert-with-typescript) by [Ahmad Jafari](https://github.com/jafari-dev).

## License

MIT
