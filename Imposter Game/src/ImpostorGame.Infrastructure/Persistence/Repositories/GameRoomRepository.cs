using ImposterGame.Application.Interfaces.Repositories;
using ImposterGame.Domain.Entites;
using ImposterGame.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ImposterGame.Infrastructure.Persistence.Repositories
{
    public class GameRoomRepository : IGameRoomRepository
    {
        private readonly ImposterGameDbContext _context;
        public GameRoomRepository(ImposterGameDbContext context)
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
                throw new KeyNotFoundException($"GameRoom with ID {roomId} not found.");
            return room;
        }

        public GameRoom GetWithPlayers(Guid roomId) => Get(roomId);

        public Player GetPlayer(Guid playerId)
        {
            return _context.Players.Find(playerId);
        }

        public IEnumerable<GameRoom> GetAllRooms()
        {
            return _context.GameRooms.Include(r => r.Players).ToList();
        }

        public IEnumerable<Player> GetAllPlayers()
        {
            return _context.Players.ToList();
        }

        public void Add(GameRoom room)
        {
            _context.GameRooms.Add(room);
        }

        public void Update(GameRoom room)
        {
            _context.GameRooms.Update(room);
        }

        public void Save(GameRoom room)
        {
            if (_context.GameRooms.Any(r => r.Id == room.Id))
                _context.GameRooms.Update(room);
            else
                _context.GameRooms.Add(room);
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}