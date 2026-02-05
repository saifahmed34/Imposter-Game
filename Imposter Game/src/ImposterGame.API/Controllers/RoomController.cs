using ImposterGame.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ImposterGame.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly IGameService _gameService;

        public RoomController(IGameService gameService)
        {
            _gameService = gameService;
        }
        [HttpPost]
        public IActionResult CreateRoom()
        {
            var roomId = _gameService.CreateRoom();
            return Ok(roomId);
        }
        [HttpPost("{roomId}/join")]
        public IActionResult JoinRoom(Guid roomId, [FromQuery] string playerName)
        {
            _gameService.JoinRoom(roomId, playerName);
            return Ok();

        }
        [HttpPost("{roomId}/start")]
        public IActionResult StartGame(Guid roomId)
        {
            _gameService.StartGame(roomId);
            return Ok();
        }
        [HttpPost("{roomId}/start-vote")]
        public IActionResult BeginVoting(Guid roomId)
        {
            _gameService.BeginVoting(roomId);
            return Ok();
        }
    }
    }
