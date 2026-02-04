using ImposterGame.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace ImposterGame.Application.DTOs
{
    public class RoomDto
    {
        public Guid Id { get; set; }
        public GamePhase Phase { get; set; }
        public List<PlayerDto> Players { get; set; }
    }
}
