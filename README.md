# Impostor Game

A real-time multiplayer **Impostor Game** built with:

- ⚙️ ASP.NET Core (Clean Architecture)
- 🗄 SQL Server + Entity Framework Core
- 🔄 SignalR (Real-time updates)
- 🌐 React + TypeScript (Frontend)

---

## 🚀 Features

- Create game rooms
- Join rooms with a player name
- Random impostor selection
- Secret word distribution
- Voting phase
- Vote resolution logic
- Real-time player updates (SignalR-ready)
- SQL Server persistence (no in-memory database)

---

## 🏗 Architecture

This project follows **Clean Architecture** principles:
ImpostorGame
│
├── ImpostorGame.API
├── ImpostorGame.Application
├── ImpostorGame.Domain
├── ImpostorGame.Infrastructure
└── impostor-game-frontend


### 🔹 Domain
- `GameRoom`
- `Player`
- Voting logic
- Game rules

### 🔹 Application
- `GameService`
- DTOs
- Interfaces

### 🔹 Infrastructure
- EF Core DbContext
- Repository implementations
- SQL Server integration

### 🔹 API
- REST controllers
- SignalR hub
- Swagger

---

## 🗄 Database Setup (SQL Server)

### 1️) Configure Connection String


# ImpostorGame.API/appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ImpostorGameDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```
## 2) Add Migration
Run from the solution root:
```
dotnet ef migrations add InitialCreate \
--project ImpostorGame.Infrastructure
```
## 3) Update Database
```
dotnet ef database update \
--project ImpostorGame.Infrastructure \
```
# Run Backend
```
cd ImpostorGame.API
dotnet run
```
### Swagger
```
http://localhost:5289/swagger
```

## Game Flow
- Create Room
- Join Room
- Start Game
- Random impostor selected
- Secret word shown to non-impostors
- Voting phase
- Vote resolution

## 🔌 API Endpoints

| Method | Endpoint                          | Description        |
|--------|-----------------------------------|--------------------|
| POST   | `/api/room`                       | Create new room    |
| POST   | `/api/room/{roomId}/join`         | Join room          |
| POST   | `/api/room/{roomId}/start`        | Start game         |
| POST   | `/api/room/{roomId}/start-vote`   | Begin voting       |
| POST   | `/api/vote/{roomId}/submit`       | Submit vote        |
| GET    | `/api/room/{roomId}`              | Get room state     |

## Tech Stack
### Backend
- .NET

- ASP.NET Core

- Entity Framework Core

- SQL Server

- SignalR

- Swagger

# 📌Future Improvements
- Authentication

- Timers per phase

- Score tracking

- Docker support

- Cloud deployment
