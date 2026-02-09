using System;
using ImposterGame.API.Requests;
using ImposterGame.Application.Interfaces.Services;
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
        public IActionResult SubmitVote(Guid roomId, [FromBody] VoteRequest voteRequest)
        {
            try
            {
                var result = _gameService.SubmitVote(roomId, voteRequest.VoterId, voteRequest.TargetId);

                if (result == null)
                {
                    return Ok(new { message = "Vote recorded, waiting for other players" });
                }

                return Ok(new
                {
                    votedOutPlayerId = result.VotedOutPlayerId,
                    impostorWasCaught = result.ImpostorWasCaught
                });
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
    }
}
