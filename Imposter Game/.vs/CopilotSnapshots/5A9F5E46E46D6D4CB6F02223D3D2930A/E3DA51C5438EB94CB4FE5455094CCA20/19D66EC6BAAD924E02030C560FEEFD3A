using ImposterGame.Application.Interfaces.Repositories;
using ImposterGame.Domain.Entites;
using ImpostorGame.Infrastructure.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace ImpostorGame.Infrastructure.Persistence.Repositories
{
    public class GameRoomRepository : IGameRoomRepository
    {
        private readonly ImpostorGameDbContext _context;
        public GameRoomRepository(ImpostorGameDbContext context)
        { 
            _context = context;
        }

        public GameRoom Get(Guid roomId)
        {
          var room = _context.GameRooms
                .Include(r => r.Players)
                .Include(r => r.Votes)
                .FirstOrDefault(r => r.Id == roomId);
            if (room == null)
            {
                throw new KeyNotFoundException($"GameRoom with ID {roomId} not found.");
            }
            return room;
        }

        public void Save(GameRoom room)
        {
            if (_context.GameRooms.Any(r => r.Id == room.Id))
                _context.GameRooms.Update(room);
            else
                _context.GameRooms.Add(room);

            _context.SaveChanges();
        }
    }
}
