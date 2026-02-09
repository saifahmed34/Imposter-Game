using System;
using ImposterGame.Application.DTOs;

namespace ImposterGame.Application.Interfaces.Services
{
    public interface IGameService
    {
        Guid CreateRoom();
        void JoinRoom(Guid roomId, string playerName);
        void StartGame(Guid roomId);
        void BeginVoting(Guid roomId);
        VoteResultDto SubmitVote(Guid roomId, Guid voterId, Guid targetId);
        RoomDto GetRoom(Guid roomId);
        void LeaveRoom(Guid playerId);
    }
}
