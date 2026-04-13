using System;
using System.Collections.Concurrent;
using ImposterGame.Application.Interfaces.Services;

namespace ImposterGame.Application.Services
{
    public class PlayerConnectionTracker : IPlayerConnectionTracker
    {
        private readonly ConcurrentDictionary<Guid, DateTime> _heartbeats = new();

        public void UpdateHeartbeat(Guid playerId)
        {
            _heartbeats[playerId] = DateTime.UtcNow;
        }

        public bool IsPlayerActive(Guid playerId, TimeSpan timeout)
        {
            if (_heartbeats.TryGetValue(playerId, out var lastHeartbeat))
            {
                return (DateTime.UtcNow - lastHeartbeat) <= timeout;
            }
            // Default to true if they are not in the dictionary yet so they don't get instantly kicked out before polling
            // But after joining they should get an initial heartbeat. We return false here to be strict,
            // assuming JoinRoom sets the first heartbeat.
            return false;
        }

        public void RemovePlayerHeartbeat(Guid playerId)
        {
            _heartbeats.TryRemove(playerId, out _);
        }
    }
}
