using ImposterGame.API.Hubs;
using ImposterGame.API.Requests;
using ImposterGame.Application.Interfaces.Services;
using ImposterGame.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace ImposterGame.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly IGameService _gameService;
        private readonly IHubContext<GameHub> _hubContext;
        private readonly ImposterGameDbContext _context;

        public RoomController(IGameService gameService, IHubContext<GameHub> hubContext,ImposterGameDbContext context)
        {
            _gameService = gameService;
            _hubContext = hubContext;
            _context = context;
        }

        [HttpGet("{roomId}")]
        public IActionResult GetRoom(Guid roomId)
        {
            try
            {
                var room = _gameService.GetRoom(roomId);
                return Ok(new { room });
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public IActionResult CreateRoom()
        {
            var roomId = _gameService.CreateRoom();
            return Ok(new { roomId });
        }

        [HttpPost("{roomId}/join")]
        public IActionResult JoinRoom(Guid roomId, [FromBody] JoinRoomRequest joinRoomRequest)
        {
            try
            {
                _gameService.JoinRoom(roomId, joinRoomRequest.PlayerName);

                // Get the updated room to find the player that was just added
                var room = _gameService.GetRoom(roomId);
                var addedPlayer = room.Players
                    .OrderByDescending(p => p.Name == joinRoomRequest.PlayerName)
                    .FirstOrDefault(p => p.Name == joinRoomRequest.PlayerName);

                if (addedPlayer != null)
                {
                    return Ok(new { playerId = addedPlayer.Id });  // ✅ Returns player ID
                }

                return Ok();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{roomId}/start")]
        public async Task<IActionResult> StartGameAsync(Guid roomId)
        {
            try
            {
                _gameService.StartGame(roomId);
                await _hubContext.Clients.Group(roomId.ToString()).SendAsync("GameStarted");
                return Ok();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("{roomId}/start-vote")]
        public async Task<IActionResult> BeginVoting(Guid roomId)
        {
            try
            {
                _gameService.BeginVoting(roomId);
                await _hubContext.Clients.Group(roomId.ToString()).SendAsync("VotingStarted");
                return Ok();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
