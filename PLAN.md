# OOP Design Patterns Learning Suite -- 7 Full-Stack Apps

## Context

The goal is to learn all OOP fundamentals, SOLID principles, and 23 GoF design patterns by building 7 small full-stack TypeScript apps. Each app covers a subset of concepts; all apps combined cover everything. Apps are ordered from simplest to most complex as a learning progression. The reference document at `oop-expert-with-typescript.md` provides the theoretical foundation -- these apps provide the practical application.

---

## App 1: TaskFlow -- Task Management Board
**Stack:** React (Vite) + Express.js + SQLite

| Category | Concepts |
|----------|----------|
| OOP Fundamentals | Class, Objects, Encapsulation, Abstraction |
| SOLID | SRP, OCP |
| Patterns | **Prototype**, **Memento**, **Iterator** |

- **Prototype**: Clone tasks from templates via `task.clone()` -- deep copies subtasks/labels
- **Memento**: Board snapshots for undo/redo -- `BoardHistory` caretaker stores state, API exposes save/restore endpoints
- **Iterator**: Custom `TaskIterator` traverses tasks across columns with filter predicates (priority, assignee, due date)
- SRP: Separate `Task`, `TaskRepository`, `TaskService`, `TaskSerializer` classes
- OCP: New task types (Bug, Feature, Story) extend `Task` without modifying it

---

## App 2: LogStream -- Logging & Monitoring Dashboard
**Stack:** React (Vite) + Express.js + MongoDB

| Category | Concepts |
|----------|----------|
| OOP Fundamentals | Inheritance, Polymorphism |
| SOLID | OCP, LSP |
| Patterns | **Chain of Responsibility**, **Singleton**, **Observer** |

- **Chain of Responsibility**: Log entries flow through handler chain: Validation > Enrichment > Filter > Storage > Alert. Each handler extends `abstract LogHandler` with `setNext()` and `handle()`
- **Singleton**: `LoggerService.getInstance()` ensures one global pipeline configuration
- **Observer**: Dashboard clients subscribe via WebSocket. `LogEventEmitter` notifies all connections when new logs arrive
- LSP: Any `LogHandler` subclass substitutable in the chain without breaking behavior

---

## App 3: PayGate -- Payment Processing System
**Stack:** React (Vite) + NestJS + PostgreSQL

| Category | Concepts |
|----------|----------|
| OOP Fundamentals | Abstraction, Polymorphism |
| SOLID | DIP, ISP, OCP |
| Patterns | **Strategy**, **Factory Method**, **State**, **Decorator** |

- **Strategy**: Interchangeable payment algorithms (Stripe, PayPal, crypto). `PaymentContext.setStrategy()` selects at runtime
- **Factory Method**: `PaymentProviderFactory.createProvider(type)` returns correct provider subclass. Uses NestJS `useFactory`
- **State**: Order lifecycle: Pending > Processing > Completed/Failed/Refunded. Each state class defines valid transitions and allowed actions
- **Decorator**: Stackable price calculators: `CurrencyDecorator(TaxDecorator(DiscountDecorator(base)))` -- each wraps and extends `calculate()`
- DIP: NestJS DI injects `PaymentProvider` interface; controllers never depend on concrete providers
- ISP: Separate interfaces `Chargeable`, `Refundable`, `Subscribable` -- not all providers support all capabilities

---

## App 4: NotifyHub -- Multi-Channel Notification System
**Stack:** React (Vite) + NestJS + PostgreSQL + Redis

| Category | Concepts |
|----------|----------|
| OOP Fundamentals | Inheritance, Encapsulation, Polymorphism |
| SOLID | SRP, ISP, DIP |
| Patterns | **Builder**, **Abstract Factory**, **Bridge**, **Mediator** |

- **Builder**: Fluent `NotificationBuilder.setTitle().setBody().addAttachment().addAction().setPriority().build()`. Directors like `buildWelcomeEmail()`, `buildOrderConfirmation()` use the builder
- **Abstract Factory**: `NotificationChannelFactory` produces families: `EmailChannel` + `EmailTemplate` + `EmailTracker` vs. `SmsChannel` + `SmsTemplate` + `SmsTracker`
- **Bridge**: Notification abstraction (Urgent, Scheduled, Batch) x delivery implementation (Email, SMS, Push). Either dimension varies independently
- **Mediator**: `NotificationMediator` coordinates event producers, user preferences, template engine, and delivery channels -- none know about each other

---

## App 5: DocEditor -- Collaborative Document Editor
**Stack:** Vanilla TypeScript + HTML/CSS (no framework) + Express.js + PostgreSQL

| Category | Concepts |
|----------|----------|
| OOP Fundamentals | Class, Objects, Encapsulation, Abstraction |
| SOLID | SRP, OCP |
| Patterns | **Command**, **Composite**, **Visitor**, **Interpreter** |

- **Command**: All editing operations (insert, delete, bold, italic) are command objects with `execute()` and `undo()`. `CommandHistory` manages undo/redo stacks
- **Composite**: Document tree: `Document` > `Section` > `Paragraph` > `TextSpan`. All implement `DocumentNode` with `render()`, `toPlainText()`, `getWordCount()`. Operations work uniformly on leaves and composites
- **Visitor**: Export as HTML/Markdown/PDF via visitors: `HtmlExportVisitor`, `MarkdownExportVisitor`. Each visitor implements `visitSection()`, `visitParagraph()`, `visitTextSpan()`. New formats = new visitor, no existing code changes
- **Interpreter**: Simple markup language parsed via grammar classes: `BoldExpression`, `ItalicExpression`, `HeadingExpression` form an AST interpreted into `DocumentNode` objects
- Vanilla frontend (no framework) forces patterns to be visible without abstraction layers

---

## App 6: CloudVault -- Virtual File System with Smart Caching
**Stack:** React (Vite) + NestJS + PostgreSQL + Redis

| Category | Concepts |
|----------|----------|
| OOP Fundamentals | Inheritance, Polymorphism, Abstraction |
| SOLID | LSP, DIP, OCP |
| Patterns | **Proxy**, **Flyweight**, **Adapter**, **Facade** |

- **Proxy**: `FileProxy` handles lazy loading (content fetched only when opened), access control (permission checks), and logging. Implements same `FileNode` interface as real file
- **Flyweight**: File icons, MIME metadata, permission templates shared from `FlyweightFactory` pool. Intrinsic state (type info) shared; extrinsic state (name, size, path) per file
- **Adapter**: `S3Adapter`, `LocalFsAdapter`, `FtpAdapter` wrap vendor APIs to common `StorageProvider` interface (`save()`, `load()`, `delete()`, `list()`)
- **Facade**: `FileManagerFacade.upload(file)` coordinates quota check, validation, compression, storage, DB update, cache invalidation, event emission

---

## App 7: ChatMesh -- Real-Time Chat with Bot Framework (Capstone)
**Stack:** React (Vite) + WebSocket + NestJS + PostgreSQL + Redis

| Category | Concepts |
|----------|----------|
| OOP Fundamentals | All six (reinforcement) |
| SOLID | All five (reinforcement) |
| Patterns | **Template Method**, **Flyweight** |

- **Template Method**: `MessageProcessor` defines skeleton: `validate()` > `sanitize()` > `transform()` > `deliver()`. Subclasses (`TextMessageProcessor`, `ImageMessageProcessor`, `FileMessageProcessor`) override specific steps
- **Flyweight**: Emoji/reaction objects shared from `EmojiFactory` pool -- thousands of messages reference shared instances

---

## Coverage Matrix (all 34 concepts verified)

| Concept | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---------|---|---|---|---|---|---|---|
| **OOP: Class** | X | | | | X | | X |
| **OOP: Objects** | X | | | | X | | X |
| **OOP: Abstraction** | X | | X | | X | | X |
| **OOP: Encapsulation** | X | | | X | X | | X |
| **OOP: Inheritance** | | X | | X | | X | X |
| **OOP: Polymorphism** | | X | X | X | | X | X |
| **SRP** | X | | | X | X | | X |
| **OCP** | X | X | X | | X | X | X |
| **LSP** | | X | | | | X | X |
| **ISP** | | | X | X | | | X |
| **DIP** | | | X | X | | X | X |
| **Abstract Factory** | | | | X | | | |
| **Builder** | | | | X | | | |
| **Factory Method** | | | X | | | | |
| **Prototype** | X | | | | | | |
| **Singleton** | | X | | | | | |
| **Adapter** | | | | | | X | |
| **Bridge** | | | | X | | | |
| **Composite** | | | | | X | | |
| **Decorator** | | | X | | | | |
| **Facade** | | | | | | X | |
| **Flyweight** | | | | | | X | X |
| **Proxy** | | | | | | X | |
| **Chain of Resp.** | | X | | | | | |
| **Command** | | | | | X | | |
| **Interpreter** | | | | | X | | |
| **Iterator** | X | | | | | | |
| **Mediator** | | | | X | | | |
| **Memento** | X | | | | | | |
| **Observer** | | X | | | | | |
| **State** | | | X | | | | |
| **Strategy** | | | X | | | | |
| **Template Method** | | | | | | | X |
| **Visitor** | | | | | X | | |

**All 34/34 concepts covered.**

---

## Difficulty Progression

| # | App | Patterns | Backend | Database | Level |
|---|-----|----------|---------|----------|-------|
| 1 | TaskFlow | 3 | Express | SQLite | Beginner |
| 2 | LogStream | 3 | Express | MongoDB | Beginner+ |
| 3 | PayGate | 4 | NestJS | PostgreSQL | Intermediate |
| 4 | NotifyHub | 4 | NestJS | PostgreSQL+Redis | Intermediate+ |
| 5 | DocEditor | 4 | Express | PostgreSQL | Advanced |
| 6 | CloudVault | 4 | NestJS | PostgreSQL+Redis | Advanced |
| 7 | ChatMesh | 2 | NestJS | PostgreSQL+Redis | Capstone |

---

## Repository Structure

```
oop-design-patterns/
  oop-expert-with-typescript.md
  PLAN.md
  apps/
    01-taskflow/
      frontend/          # React + Vite
      backend/           # Express + SQLite
    02-logstream/
      frontend/          # React + Vite
      backend/           # Express + MongoDB
    03-paygate/
      frontend/          # React + Vite
      backend/           # NestJS + PostgreSQL
    04-notifyhub/
      frontend/          # React + Vite
      backend/           # NestJS + PostgreSQL + Redis
    05-doceditor/
      frontend/          # Vanilla TS + HTML/CSS
      backend/           # Express + PostgreSQL
    06-cloudvault/
      frontend/          # React + Vite
      backend/           # NestJS + PostgreSQL + Redis
    07-chatmesh/
      frontend/          # React + Vite + WebSocket
      backend/           # NestJS + PostgreSQL + Redis
```

---

## Verification Plan

For each app:
1. Backend starts without errors and all endpoints respond correctly
2. Frontend renders and interacts with the backend
3. Each pattern is identifiable in the code (named files/classes matching the pattern)
4. Each app's README explains which patterns are used and where in the code they live
5. Unit tests verify pattern behavior (e.g., Memento restore works, Strategy swaps correctly, Chain passes/stops correctly)
