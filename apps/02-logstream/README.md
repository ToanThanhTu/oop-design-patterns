# LogStream -- Logging & Monitoring Dashboard

A centralized logging service where applications send logs through a processing pipeline. Logs are stored and displayed on a real-time dashboard via WebSocket. Different log levels trigger different behaviors.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Backend | Express.js |
| Database | MongoDB |

## Concepts Covered

### OOP Fundamentals
- **Inheritance** -- Log handler hierarchy: `BaseHandler` > `ConsoleHandler`, `FileHandler`, `AlertHandler`
- **Polymorphism** -- All handlers implement `handle(log)` but behave differently

### SOLID Principles
- **OCP** -- Add new log handlers without modifying the chain
- **LSP** -- Any `LogHandler` subclass can replace another in the chain without breaking behavior

### Design Patterns

#### Chain of Responsibility
Log entries pass through a handler chain at startup: ValidationHandler > EnrichmentHandler > FilterHandler > StorageHandler > AlertHandler. Each handler extends `abstract LogHandler` with `setNext()` and `handle()`. Handlers can short-circuit (e.g., filter drops DEBUG in production).

#### Singleton
`LoggerService.getInstance()` ensures the handler chain is configured once and reused across all route handlers. Provides a clean `LoggerService.log(entry)` API.

#### Observer
A `LogEventEmitter` (the subject) maintains a set of WebSocket connections (observers). When `StorageHandler` persists a log, it calls `logEventEmitter.notify(log)`, pushing the log to all connected dashboard clients in real time.

## Getting Started

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```
