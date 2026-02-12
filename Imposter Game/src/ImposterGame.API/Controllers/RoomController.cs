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

                // Get votes from the database
                var votes = _context.Votes
                    .Where(v => v.RoomId == roomId)
                    .ToList()
                    .Select(v => new {
                        VoterId = v.VoterId,
                        TargetId = v.TargetId
                    })
                    .ToList();

                return Ok(new
                {
                    room = room,
                    votes = votes
                });
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
                // normalize requested name
                var baseName = (joinRoomRequest?.PlayerName ?? "").Trim();
                if (string.IsNullOrWhiteSpace(baseName))
                    baseName = "Player";

                // get current room and existing player names
                var room = _gameService.GetRoom(roomId);
                if (room == null)
                    return NotFound($"Room {roomId} not found.");

                var existingNames = new HashSet<string>(
                    room.Players.Select(p => p.Name ?? string.Empty),
                    StringComparer.OrdinalIgnoreCase
                );

                // pick a unique name: if baseName exists, append numbers starting from 1
                var finalName = baseName;
                var suffix = 1;
                while (existingNames.Contains(finalName))
                {
                    finalName = baseName + suffix; // e.g. "Alice1"
                    suffix++;
                }

                // now add the player with the unique name
                _gameService.JoinRoom(roomId, finalName);

                // retrieve updated room and the newly added player
                room = _gameService.GetRoom(roomId);
                var addedPlayer = room.Players
                    .FirstOrDefault(p => string.Equals(p.Name, finalName, StringComparison.OrdinalIgnoreCase));

                if (addedPlayer != null)
                {
                    return Ok(new { playerId = addedPlayer.Id, playerName = finalName });
                }

                // fallback: success but couldn't find the added player (shouldn't happen)
                return Ok(new { playerName = finalName });
            }
            catch (Exception ex)
            {
                // log exception as appropriate (not shown here)
                return StatusCode(500, "An error occurred while joining the room.");
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
