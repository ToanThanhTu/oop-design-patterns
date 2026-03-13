# CloudVault -- Virtual File System with Smart Caching

A cloud storage interface (like a simplified Dropbox) where users manage files and folders with access control, lazy loading, smart caching for frequently accessed files, and integration with multiple storage backends.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Backend | NestJS |
| Database | PostgreSQL + Redis |

## Concepts Covered

### OOP Fundamentals
- **Inheritance** -- `FileSystemNode` > `File`, `Folder` hierarchy
- **Polymorphism** -- Uniform operations on files and folders
- **Abstraction** -- Storage backend details hidden behind interfaces

### SOLID Principles
- **LSP** -- `File` and `Folder` both substitutable as `FileSystemNode` in all tree operations
- **DIP** -- Services depend on `StorageProvider` interface, not AWS S3 or local filesystem directly
- **OCP** -- New storage backends added by implementing the interface

### Design Patterns

#### Proxy
`FileProxy` acts as a stand-in for actual file content. It handles lazy loading (content fetched only when opened), access control (checks permissions before allowing operations), and logging (records all access attempts). Implements the same `FileNode` interface as the real file -- the frontend never knows it's working with a proxy.

#### Flyweight
File icons, MIME type metadata, and permission templates are shared flyweight objects. A `FlyweightFactory` maintains a pool of shared `FileTypeInfo` objects (icon, color, MIME type, default application). When rendering 500 files, each references a shared flyweight rather than duplicating metadata. Intrinsic state (type info) is shared; extrinsic state (name, size, path) stays on each file.

#### Adapter
Multiple storage backends with incompatible APIs are adapted to a common `StorageProvider` interface. `S3Adapter` wraps `putObject()`/`getObject()`, `LocalFsAdapter` wraps `writeFile()`/`readFile()`, `FtpAdapter` wraps `upload()`/`download()`. All expose `save(path, data)`, `load(path)`, `delete(path)`, `list(prefix)`.

#### Facade
`FileManagerFacade` provides a simplified API coordinating complex subsystems. The upload flow involves: check quota, validate file type, compress, store via adapter, update database, invalidate cache, emit event. `FileManagerFacade.upload(file)` handles all of this. The controller just calls the facade.

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
