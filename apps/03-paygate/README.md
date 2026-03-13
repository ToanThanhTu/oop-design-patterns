# PayGate -- Payment Processing System

A checkout system supporting multiple payment providers (Stripe, PayPal, crypto), multiple currencies, and stackable discount/tax/currency calculation. Orders go through a defined lifecycle with clear state transitions.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Backend | NestJS |
| Database | PostgreSQL |

## Concepts Covered

### OOP Fundamentals
- **Abstraction** -- `PaymentProvider` abstract interface hides provider-specific implementation
- **Polymorphism** -- Different payment strategies share the same `processPayment()` interface

### SOLID Principles
- **DIP** -- NestJS modules inject `PaymentProvider` interface; controllers never depend on Stripe/PayPal directly
- **ISP** -- Separate interfaces: `Chargeable`, `Refundable`, `Subscribable` -- not all providers support all capabilities
- **OCP** -- Add new payment providers by implementing interfaces, no existing code changes

### Design Patterns

#### Strategy
A `PaymentContext` class holds a `PaymentStrategy` reference. At checkout, the frontend sends the chosen payment method. The backend's `PaymentContext.setStrategy()` selects the right strategy, then `context.executePayment(amount)` delegates to it. Each strategy encapsulates provider-specific API calls.

#### Factory Method
`PaymentProviderFactory.createProvider(type)` instantiates the correct provider class. NestJS's `useFactory` provider pattern makes this clean. Subclass factories (`PaypalFactory`, `StripeFactory`) override the creation method.

#### State
The `Order` class has a `state` property of type `OrderState`. Each state class (`PendingState`, `ProcessingState`, `CompletedState`, `FailedState`, `RefundedState`) implements `pay()`, `cancel()`, `refund()`. Invalid transitions throw descriptive errors.

#### Decorator
Price calculation uses stackable decorators: `new CurrencyDecorator(new TaxDecorator(new DiscountDecorator(baseCalculator)))`. Each decorator's `calculate()` calls the wrapped object's `calculate()` and adds its own logic.

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
