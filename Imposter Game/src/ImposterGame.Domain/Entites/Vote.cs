using System;

namespace ImposterGame.Domain.Entites
{
    public class Vote
    {
        public Guid Id { get; set; }
        public Guid VoterId { get; set; }
        public Guid TargetId { get; set; }
        public Guid RoomId { get; set; }

        // Navigation properties
        public GameRoom? Room { get; set; }

        public Vote() { }

        public Vote(Guid voterId, Guid targetId) : this()
        {
            VoterId = voterId;
            TargetId = targetId;
        }
    }
}
