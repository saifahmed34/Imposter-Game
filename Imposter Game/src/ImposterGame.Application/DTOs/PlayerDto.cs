using System;

namespace ImposterGame.Application.DTOs
{
    public class PlayerDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public bool HasVoted { get; set; }
        public bool IsImposter { get; set; }
        public string? Word { get; set; }
    }
}
