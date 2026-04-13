using System;

namespace ImposterGame.Application.Interfaces.Services
{
    public interface IPlayerConnectionTracker
    {
        void UpdateHeartbeat(Guid playerId);
        bool IsPlayerActive(Guid playerId, TimeSpan timeout);
        void RemovePlayerHeartbeat(Guid playerId);
    }
}
