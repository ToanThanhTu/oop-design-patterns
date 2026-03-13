# NotifyHub -- Multi-Channel Notification System

A notification platform where events trigger notifications across multiple channels (email, SMS, push, in-app). Users configure preferences. Notifications are built with complex structures and can be grouped hierarchically.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Backend | NestJS |
| Database | PostgreSQL + Redis |

## Concepts Covered

### OOP Fundamentals
- **Inheritance** -- Notification channel hierarchy
- **Encapsulation** -- User preferences encapsulated with validation logic
- **Polymorphism** -- All channels implement `send()` but each formats/delivers differently

### SOLID Principles
- **SRP** -- Separate classes for building, routing, delivering, and persisting notifications
- **ISP** -- `Sendable`, `Trackable`, `Retryable` interfaces -- not all channels support all capabilities
- **DIP** -- Services depend on channel interfaces, not concrete implementations

### Design Patterns

#### Builder
`NotificationBuilder` uses a fluent API: `.setTitle().setBody().addAttachment().addAction().setPriority().setSchedule().build()`. A `NotificationDirector` has methods like `buildWelcomeEmail()`, `buildPasswordReset()`, `buildOrderConfirmation()` that use the builder to construct specific configurations. The builder validates required fields before `build()` returns.

#### Abstract Factory
`createChannelFactory('email')` returns an `EmailChannelFactory` that produces `EmailSender`, `EmailFormatter`, and `EmailDeliveryTracker`. Switching to SMS means swapping the factory -- all produced objects remain internally consistent.

#### Bridge
Notification abstraction (UrgentNotification, ScheduledNotification, BatchNotification) and delivery implementation (EmailDelivery, SmsDelivery, PushDelivery) vary independently. `new UrgentNotification(new PushDelivery())` sends an immediate push; `new ScheduledNotification(new EmailDelivery())` queues an email.

#### Mediator
`NotificationMediator` receives events like `orderPlaced`, checks user preferences via `PreferenceService`, selects templates via `TemplateService`, builds notifications via `NotificationBuilder`, and dispatches via the appropriate channel -- none of these services know about each other.

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
