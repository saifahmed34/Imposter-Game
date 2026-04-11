using System;
using System.Collections.Generic;
using ImposterGame.Domain.Enums;

namespace ImposterGame.Application.DTOs
{
    public class RoomDto
    {
        public Guid Id { get; set; }
        public string? Category { get; set; }
        public GamePhase Phase { get; set; }
        public List<PlayerDto> Players { get; set; } = new();
        //new
        public MyRoleDto? MyRole { get; set; }
    }
}
