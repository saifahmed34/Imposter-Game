// testing area for ImposterGame application+Domain layers

using ImposterGame.Application.Interfaces.Repositories;
using ImposterGame.Application.Interfaces.Services;
using ImposterGame.Domain.Entites;
using ImpostorGame.Application.Services;

class Program
{
    static void Main()
    {
        // ----------------------------
        //Setup repository & word provider
        // ----------------------------
        var repo = new InMemoryGameRoomRepository();
        var wordProvider = new SimpleWordProvider();

        // 2️⃣ Setup game service
        var game = new GameService(repo, wordProvider);

        // ----------------------------
        //Create room
        // ----------------------------
        var roomId = game.CreateRoom();
        Console.WriteLine($"Room created: {roomId}");

        // ----------------------------
        // Join players
        // ----------------------------
        string[] playerNames = { "Alice", "Bob", "Charlie", "Diana" };
        foreach (var name in playerNames)
        {
            game.JoinRoom(roomId, name);
            Console.WriteLine($"{name} joined the room");
        }

        // ----------------------------
        // Start the game
        // ----------------------------
        game.StartGame(roomId);
        var room = repo.Get(roomId); // get domain object to see IsImpostor
        Console.WriteLine($"\nGame started! Phase: {room.Phase}");
        Console.WriteLine("Players:");
        foreach (var p in room.Players)
            Console.WriteLine($"- {p.Name}");

        // ----------------------------
        // Reveal impostor (for test)
        // ----------------------------
        var impostor = room.Players.First(p => p.IsImpostor);
        Console.WriteLine($"\n[DEBUG] Impostor is: {impostor.Name}");

        // ----------------------------
        // Begin voting
        // ----------------------------
        game.BeginVoting(roomId);
        Console.WriteLine($"\nVoting started! Phase: {game.GetRoom(roomId).Phase}");

        // ----------------------------
        // Submit votes (simulate)
        // ----------------------------
        foreach (var voter in room.Players)
        {
            // vote for the first player who is NOT themselves
            var target = room.Players.First(p => p.Id != voter.Id);
            var result = game.SubmitVote(roomId, voter.Id, target.Id);

            Console.WriteLine($"{voter.Name} voted for {target.Name}");

            // Check if voting finished
            if (result != null)
            {
                var votedOutPlayer = room.Players.First(p => p.Id == result.VotedOutPlayerId);
                Console.WriteLine("\n--- Voting Finished ---");
                Console.WriteLine($"Player voted out: {votedOutPlayer.Name}");
                Console.WriteLine(result.ImpostorWasCaught
                    ? "Impostor was caught! Players win 🎉"
                    : "Impostor escaped! Impostor wins 😈");

                // Show all players with impostor info
                Console.WriteLine("\nPlayer roles:");
                foreach (var p in room.Players)
                    Console.WriteLine($"- {p.Name} (Impostor: {p.IsImpostor})");
            }
        }
    }
}

// ----------------------------
// In-memory test classes
// ----------------------------
class InMemoryGameRoomRepository : IGameRoomRepository
{
    private readonly Dictionary<Guid, GameRoom> _store = new();

    public GameRoom Get(Guid roomId)
    {
        if (_store.TryGetValue(roomId, out var room))
            return room;
        throw new KeyNotFoundException("Game room not found");
    }

    public void Save(GameRoom room)
    {
        _store[room.Id] = room;
    }
}

class SimpleWordProvider : IWordProvider
{
    private static readonly string[] Words = new[] { "apple", "banana", "carrot" };
    public string GetRandomWord() => Words[Random.Shared.Next(Words.Length)];
}
