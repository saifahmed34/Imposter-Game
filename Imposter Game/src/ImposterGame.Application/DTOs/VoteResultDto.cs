using System;
using System.Collections.Generic;
using System.Text;

namespace ImposterGame.Application.DTOs
{
    public class VoteResultDto
    {
        public Guid VotedOutPlayerId { get; set; }
        public bool ImpostorWasCaught { get; set; }
    }
}
