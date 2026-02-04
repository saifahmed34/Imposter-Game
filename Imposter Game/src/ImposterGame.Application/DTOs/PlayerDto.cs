using System;
using System.Collections.Generic;
using System.Text;

namespace ImposterGame.Application.DTOs
{
    public class PlayerDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public bool HasVoted { get; set; }
    }
}
