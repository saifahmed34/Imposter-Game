using System;
using ImposterGame.Application.DTOs;

namespace ImposterGame.Application.Interfaces.Services
{
    public interface IGameService
    {
        Guid CreateRoom();
        void JoinRoom(Guid roomId, string playerName);
        void StartGame(Guid roomId, string category);
        void BeginVoting(Guid roomId);
        void ResetRoom(Guid roomId);
        VoteResultDto SubmitVote(Guid roomId, Guid voterId, Guid targetId);

        RoomDto GetRoom(Guid roomId, Guid? playerId = null);
        
        void LeaveRoom(Guid playerId,Guid PlayerId);
    }
}
