# ChatMesh -- Real-Time Chat with Bot Framework

A real-time chat application with rooms, direct messages, message formatting, and a bot/plugin framework. Messages are processed through a type-specific pipeline. This is the capstone project reinforcing all OOP fundamentals and SOLID principles.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) + WebSocket |
| Backend | NestJS (WebSocket gateway) |
| Database | PostgreSQL + Redis |

## Concepts Covered

### OOP Fundamentals
All six fundamentals are reinforced throughout:
- **Class & Objects** -- `ChatRoom`, `Message`, `User`, `Bot` classes
- **Abstraction** -- `MessageProcessor` abstract class hides processing details
- **Encapsulation** -- Room state and user sessions managed through controlled interfaces
- **Inheritance** -- Processor hierarchy: `TextMessageProcessor`, `ImageMessageProcessor`, `FileMessageProcessor`
- **Polymorphism** -- All processors implement `process()` but each handles validation, sanitization, and transformation differently

### SOLID Principles
All five principles are reinforced throughout:
- **SRP** -- Separate classes for rooms, messages, users, bots, processing
- **OCP** -- New message types added by extending `MessageProcessor`
- **LSP** -- Any processor subclass substitutable in the pipeline
- **ISP** -- `Sendable`, `Moderatable`, `Archivable` -- bots don't implement moderation
- **DIP** -- Services depend on processor/channel interfaces, not concrete classes

### Design Patterns

#### Template Method
`MessageProcessor` abstract class defines the processing skeleton as a final `process()` method calling `validate()` > `sanitize()` > `transform()` > `deliver()` in order. `TextMessageProcessor` overrides `sanitize()` to strip HTML and `transform()` to parse markdown. `ImageMessageProcessor` overrides `validate()` to check file size and `transform()` to generate thumbnails. The processing skeleton never changes.

#### Flyweight
`EmojiFactory` maintains a shared pool of emoji instances. When a message contains `:thumbsup:`, the factory returns the shared `Emoji` instance rather than creating a new one. Each message-emoji association stores only extrinsic state (position in message, user who reacted) while the emoji itself (image URL, unicode point, name) is shared across all messages.

## Getting Started

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```
