using System;
using System.Collections.Generic;
using System.Text;

namespace ImposterGame.Domain.Entites
{
    public class Player
    {
        public Guid Id { get; } = Guid.NewGuid();
        public string Name { get; }
        public bool IsImpostor { get; internal set; }
        public bool HasVoted { get; internal set; }

        public Player(string name)
        {
            Name = name;
        }
        public void ResetVote()
        {
            HasVoted = false;
        }
    }
}
