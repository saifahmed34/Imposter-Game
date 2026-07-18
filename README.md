# Impostor Game

A real-time multiplayer **Imposter Game** built with modern web technologies. Players must identify the imposter in the room while the imposter tries to blend in without knowing the secret word.

## 🌐 Live Demo

🎮 **Play Now:** https://impostergame-gilt.vercel.app/

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Setup & Installation](#-setup--installation)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Game Rules & Flow](#-game-rules--flow)
- [Project Structure](#-project-structure)
- [Future Improvements](#-future-improvements)

---

## 🚀 Features

- ✅ **Create & Join Game Rooms** - Host or join games with unique room codes
- ✅ **Smart Room Management** - Automatically cleans up empty game rooms to optimize resource usage and preserves player sessions on game resets
- ✅ **Random Impostor Selection** - Automatically assigns one player as the imposter
- ✅ **Secret Word System** - All players except the imposter see the secret word
- ✅ **Randomized Game Mode** - Start games instantly with a random word from any category without manual selection
- ✅ **Anti-Cheat Mechanism** - Enhanced data security ensures roles and secret words are strictly hidden from network traffic to prevent inspecting payloads
- ✅ **Real-time Updates** - SignalR enables live player-to-player communication
- ✅ **Voting Phase** - Players vote to eliminate suspected impostors
- ✅ **Vote Resolution** - Automatic logic determines game winner
- ✅ **Persistent Storage** - SQL Server database for game history
- ✅ **Responsive UI** - Works seamlessly on desktop and mobile devices

---

## 🛠 Tech Stack

### Backend
- **Language:** C# (.NET 10)
- **Framework:** ASP.NET Core
- **Real-time Communication:** SignalR
- **Database:** SQL Server + Entity Framework Core
- **API Documentation:** Swagger/OpenAPI
- **Architecture:** Clean Architecture

### Frontend
- **Language:** TypeScript
- **Framework:** React 18+
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Testing:** Vitest

---

## 🏗 Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

```
Imposter Game/
├── ImpostorGame.API              # REST API & SignalR Hub
├── ImpostorGame.Application       # Business Logic & Services
├── ImpostorGame.Domain            # Core Entities & Rules
├── ImpostorGame.Infrastructure    # Database & Repositories
└── impostor-game-frontend         # React UI
```

### Backend Layers

**Domain Layer** (`ImpostorGame.Domain`)
- `GameRoom` - Room entity with game state
- `Player` - Player information & roles
- `Vote` - Voting records
- `GamePhase` - Game state machine
- `GameRules` - Business logic validation

**Application Layer** (`ImpostorGame.Application`)
- `GameService` - Core game orchestration
- DTOs - Data transfer objects
- Interfaces - Repository & service contracts

**Infrastructure Layer** (`ImpostorGame.Infrastructure`)
- Entity Framework Core DbContext
- Repository implementations
- Database migrations

**API Layer** (`ImpostorGame.API`)
- `RoomController` - Room management endpoints
- `VoteController` - Voting endpoints
- `GameHub` - SignalR real-time hub
- Request/Response models

---

## 📋 Prerequisites

- **Backend:**
  - [.NET 10 SDK](https://dotnet.microsoft.com/download) or higher
  - SQL Server (Local, Docker, or remote instance)
  - Visual Studio 2022 or VS Code with C# extension

- **Frontend:**
  - [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/)
  - npm or bun package manager

---

## 🔧 Setup & Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Imposter-Game
```

### 2. Backend Setup

#### Configure Database Connection

Edit `Imposter Game/src/ImposterGame.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ImpostorGameDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

**Note:** Adjust the connection string based on your SQL Server setup (e.g., for Docker or remote servers).

#### Apply Database Migrations

From the solution root directory:

```bash
cd "Imposter Game/src"

# Add migration (if needed)
dotnet ef migrations add InitialCreate --project ImpostorGame.Infrastructure

# Update database
dotnet ef database update --project ImpostorGame.Infrastructure
```

### 3. Frontend Setup

```bash
cd "Imposter Game/impostor-game-frontend"

# Install dependencies
npm install
# or
bun install
```

---

## 🎮 Running the Application

### Start the Backend

```bash
cd "Imposter Game/src/ImposterGame.API"
dotnet run
```

Backend runs at: `http://localhost:5289`
- API: `http://localhost:5289/api`
- Swagger Docs: `http://localhost:5289/swagger`
- SignalR Hub: `ws://localhost:5289/gamehub`

### Start the Frontend

```bash
cd "Imposter Game/impostor-game-frontend"

# Development server
npm run dev
# or
bun run dev
```

Frontend runs at: `http://localhost:8080` (Vite default)

### Building for Production

**Frontend:**
```bash
npm run build
npm run preview
```

**Backend:**
```bash
dotnet build -c Release
dotnet publish -c Release -o ./publish
```

---

## 🔌 API Endpoints

### Room Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/room` | Create a new game room |
| `GET` | `/api/room/{roomId}` | Get room details & player list |
| `POST` | `/api/room/{roomId}/join` | Join an existing room |
| `POST` | `/api/room/{roomId}/leave` | Leave an active room |
| `POST` | `/api/room/{roomId}/start` | Start the game (optional category mapping or random) |
| `POST` | `/api/room/{roomId}/start-vote` | Manually begin the voting phase |
| `POST` | `/api/room/{roomId}/reset` | Reset the room for another round with existing players |

### Voting

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/vote/{roomId}/submit` | Submit a vote |

### SignalR Events

**Client → Server:**
- `JoinRoom` - Notify when player joins
- `SubmitVote` - Submit vote during voting phase
- `LeaveRoom` - Disconnect from room

**Server → Client:**
- `PlayerJoined` - Broadcast new player
- `GameStarted` - Notify game has started (send secret word if applicable)
- `VotingPhaseStarted` - Start voting countdown
- `VotingResultsReceived` - Display vote results
- `GameEnded` - Show winner & game stats

---

## 🎯 Game Rules & Flow

### Game Phases

1. **Lobby Phase**
   - Players join the room
   - Waiting for game to start
   - Minimum 3 players required (configurable)

2. **Game Phase**
   - One random player assigned as imposter
   - All non-impostors see the secret word
   - Imposter sees nothing
   - Discussion phase (real-time chat)

3. **Voting Phase**
   - All players vote to eliminate someone
   - Majority vote wins (ties broken by random selection)
   - If imposter is eliminated → non-impostors win
   - If imposter survives → imposter wins

4. **Results Phase**
   - Display winner
   - Show who was the imposter
   - Option to play again

### Winning Conditions

- **Non-Impostors Win:** Imposter is successfully eliminated
- **Imposter Wins:** Survives the voting phase or non-impostors cannot reach consensus

---

## 📁 Project Structure

```
Imposter Game/
├── src/
│   ├── ImposterGame.API/
│   │   ├── Controllers/
│   │   │   ├── RoomController.cs
│   │   │   └── VoteController.cs
│   │   ├── Hubs/
│   │   │   └── GameHub.cs
│   │   ├── Requests/
│   │   ├── Program.cs
│   │   ├── appsettings.json
│   │   └── ImposterGame.API.csproj
│   ├── ImposterGame.Application/
│   │   ├── Services/
│   │   │   └── GameService.cs
│   │   ├── DTOs/
│   │   │   ├── PlayerDto.cs
│   │   │   ├── RoomDto.cs
│   │   │   └── VoteResultDto.cs
│   │   └── Interfaces/
│   ├── ImposterGame.Domain/
│   │   ├── Entities/
│   │   │   ├── GameRoom.cs
│   │   │   ├── Player.cs
│   │   │   └── Vote.cs
│   │   ├── Enums/
│   │   │   └── GamePhase.cs
│   │   └── Rules/
│   │       └── GameRules.cs
│   └── ImpostorGame.Infrastructure/
│       ├── Persistence/
│       ├── Migrations/
│       └── ImpostorGame.Infrastructure.csproj
├── impostor-game-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── NavLink.tsx
│   │   │   ├── PlayerList.tsx
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   ├── Index.tsx
│   │   │   ├── Join.tsx
│   │   │   ├── Lobby.tsx
│   │   │   ├── Game.tsx
│   │   │   ├── Voting.tsx
│   │   │   ├── Results.tsx
│   │   │   └── NotFound.tsx
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── package.json
│   └── README.md
├── Imposter Game.sln
└── README.md
```

---

## 📌 Future Improvements

- 🔐 **Authentication & Authorization** - User accounts, login, game history
- ⏱️ **Game Timers** - Discussion and voting phase timers with countdown
- 🏆 **Score Tracking** - Win/loss statistics, leaderboard
- 💬 **In-game Chat** - Real-time messaging between players
- 🎨 **Customization** - Game settings, room themes, player avatars
- 🐳 **Docker Support** - Containerized deployment
- ☁️ **Cloud Deployment** - Azure, AWS, or DigitalOcean
- 📱 **Mobile App** - Native mobile version with React Native
- 🤖 **AI Players** - Bot support for single-player practice
- 🌍 **Multi-language Support** - i18n internationalization

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature suggestions.

---

## 📄 License

This project is open source and available under the MIT License.
