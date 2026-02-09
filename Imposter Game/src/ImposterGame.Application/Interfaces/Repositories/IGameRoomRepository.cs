using System;
using ImposterGame.Domain.Entites;

namespace ImposterGame.Application.Interfaces.Repositories
{
    public interface IGameRoomRepository
    {
        GameRoom? GetWithPlayers(Guid roomId);
        Player? GetPlayer(Guid playerId);
        void Add(GameRoom room);
        void Update(GameRoom room);
        void SaveChanges();
    }
}
