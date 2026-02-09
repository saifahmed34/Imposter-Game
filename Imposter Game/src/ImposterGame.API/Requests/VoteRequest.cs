using System;

namespace ImposterGame.API.Requests
{
    public class VoteRequest
    {
        public Guid VoterId { get; set; }
        public Guid TargetId { get; set; }
    }
}
