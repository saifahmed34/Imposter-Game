using ImposterGame.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ImposterGame.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoteController : ControllerBase
    {
        private readonly IGameService _gameService;
        public VoteController(IGameService gameService)
        {
            _gameService = gameService;
        }
        [HttpPost("{roomId}/submit")]
        public IActionResult SubmitVote(Guid roomId, [FromQuery] Guid voterId, [FromQuery] Guid targetId)
        {
            var result = _gameService.SubmitVote(roomId, voterId, targetId);
            if (result == null)
                return Ok("Vote recorded. Waiting for other players.");
            return Ok(result);
        }
    }
}
