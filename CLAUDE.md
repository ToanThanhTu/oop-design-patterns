# Project: OOP Design Patterns Learning Suite

## Overview

A monorepo of 7 full-stack TypeScript apps that teach OOP fundamentals, SOLID principles, and all 23 GoF design patterns through practical implementation. Each app covers a subset of concepts; all apps combined cover everything (34 concepts total).

## Architecture

- `PLAN.md` -- detailed implementation plan with pattern descriptions and coverage matrix
- `oop-expert-with-typescript.md` -- theory reference (from [jafari-dev/oop-expert-with-typescript](https://github.com/jafari-dev/oop-expert-with-typescript))
- `apps/01-taskflow/` through `apps/07-chatmesh/` -- the 7 apps, each with `frontend/` and `backend/`

## Apps & Their Stacks

| # | App | Backend | Database | Patterns |
|---|-----|---------|----------|----------|
| 1 | `01-taskflow` | Express | SQLite | Prototype, Memento, Iterator |
| 2 | `02-logstream` | Express | MongoDB | Chain of Responsibility, Singleton, Observer |
| 3 | `03-paygate` | NestJS | PostgreSQL | Strategy, Factory Method, State, Decorator |
| 4 | `04-notifyhub` | NestJS | PostgreSQL + Redis | Builder, Abstract Factory, Bridge, Mediator |
| 5 | `05-doceditor` | Express | PostgreSQL | Command, Composite, Visitor, Interpreter |
| 6 | `06-cloudvault` | NestJS | PostgreSQL + Redis | Proxy, Flyweight, Adapter, Facade |
| 7 | `07-chatmesh` | NestJS | PostgreSQL + Redis | Template Method, Flyweight |

All frontends are React (Vite) except `05-doceditor` which uses vanilla TypeScript + HTML/CSS.

## Build Status

None of the apps have been scaffolded/implemented yet. The repo currently contains only READMEs, the plan, and the theory reference.

## Conventions

- TypeScript strict mode for all apps
- Each app's README documents which patterns it covers and how they manifest
- Patterns should feel natural to the app's domain, not contrived
- Express apps: `npm run dev` to start
- NestJS apps: `npm run start:dev` to start
- Frontend apps: `npm run dev` to start (Vite)

## Implementation Order

Build apps 1 through 7 in order (beginner to capstone). For each app, build backend first, then frontend.
