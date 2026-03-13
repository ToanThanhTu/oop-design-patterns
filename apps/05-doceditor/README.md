# DocEditor -- Collaborative Document Editor

A simplified document editor where users create documents, format text with stackable styles, execute editing commands with undo/redo, and export to multiple formats. Includes a simple markup language for power users. Built with vanilla TypeScript -- no framework.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla TypeScript + HTML/CSS |
| Backend | Express.js |
| Database | PostgreSQL |

## Concepts Covered

### OOP Fundamentals
- **Class** -- `Document`, `TextBlock`, `Command` classes
- **Objects** -- Document and block instances
- **Encapsulation** -- Document internal state protected, exposed via command execution
- **Abstraction** -- Format operations abstracted behind command interface

### SOLID Principles
- **SRP** -- Separate concerns: editing commands, document model, rendering, export
- **OCP** -- New export formats added without modifying existing exporters

### Design Patterns

#### Command
Every user action creates a command object. `InsertTextCommand` stores the position and text; `execute()` inserts, `undo()` removes. A `CommandHistory` class manages the undo/redo stacks. Toolbar buttons and keyboard shortcuts all create and execute commands.

#### Composite
Document tree: `Document` contains `Section`s, which contain `Paragraph`s, which contain `TextSpan`s. All implement a `DocumentNode` interface with `render()`, `toPlainText()`, `getWordCount()`. Calling `document.getWordCount()` recursively sums word counts of all children. Operations work uniformly on leaves and composites.

#### Visitor
Rather than putting export logic in every node class (violating SRP/OCP), a `DocumentVisitor` interface declares visit methods for each node type. Each node has an `accept(visitor)` method. `HtmlExportVisitor`, `MarkdownExportVisitor`, and `PdfExportVisitor` each traverse the tree and produce output. New export formats require only a new visitor class.

#### Interpreter
Users can type markup like `**bold**` and `_italic_`. The interpreter tokenizes input, builds an expression tree (`BoldExpression`, `ItalicExpression`, `HeadingExpression`, `LinkExpression`), and evaluates it into `DocumentNode` objects.

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
