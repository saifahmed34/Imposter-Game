using Microsoft.AspNetCore.SignalR;
using ImposterGame.Application.Interfaces.Services;

namespace ImposterGame.API.Hubs
{
    public class GameHub : Hub
    {
        private readonly IGameService _gameService;

        public GameHub(IGameService gameService)
        {
            _gameService = gameService;
        }

        public async Task VoteSubmitted(string roomId)
        {
            var room = _gameService.GetRoom(Guid.Parse(roomId));
            await Clients.Group(roomId).SendAsync("PlayersUpdated", room.Players);
        }

        public async Task JoinRoom(string roomId, string playerName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            // Optionally, you can call the game service to register something
            var room = _gameService.GetRoom(Guid.Parse(roomId));

            // Notify everyone in room about updated players
            await Clients.Group(roomId).SendAsync("PlayersUpdated", room.Players);
        }
    }
}