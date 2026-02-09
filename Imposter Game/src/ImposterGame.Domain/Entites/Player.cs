using System;

namespace ImposterGame.Domain.Entites
{
    public class Player
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid RoomId { get; set; }
        public bool HasVoted { get; set; }
        public bool IsImposter { get; set; }
        public string? Word { get; set; }
        public Guid? VotedForId { get; set; }

        // Navigation property
        public GameRoom? Room { get; set; }

        // Constructors
        public Player() { }

        public Player(string name) : this()
        {
            Name = name;
        }

        // Methods
        public void ResetVote()
        {
            HasVoted = false;
            VotedForId = null;
        }

        public void Vote(Guid targetId)
        {
            VotedForId = targetId;
            HasVoted = true;
        }
    }
}
