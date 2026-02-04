using ImposterGame.Application.DTOs;
using ImposterGame.Application.Interfaces.Repositories;
using ImposterGame.Application.Interfaces.Services;
using ImposterGame.Domain.Entites;

namespace ImpostorGame.Application.Services
{
    public class GameService : IGameService
    {
        private readonly IGameRoomRepository _roomRepo;
        private readonly IWordProvider _wordProvider;

        public GameService(IGameRoomRepository roomRepo, IWordProvider wordProvider)
        {
            _roomRepo = roomRepo;
            _wordProvider = wordProvider;
        }

        public Guid CreateRoom()
        {
            var room = new GameRoom();
            _roomRepo.Save(room);
            return room.Id;
        }

        public void JoinRoom(Guid roomId, string playerName)
        {
            var room = _roomRepo.Get(roomId);
            room.AddPlayer(new Player(playerName));
            _roomRepo.Save(room);
        }

        public void StartGame(Guid roomId)
        {
            var room = _roomRepo.Get(roomId);
            var word = _wordProvider.GetRandomWord();
            room.StartGame(word);
            _roomRepo.Save(room);
        }

        public void BeginVoting(Guid roomId)
        {
            var room = _roomRepo.Get(roomId);
            room.BeginVoting();
            _roomRepo.Save(room);
        }

        public VoteResultDto SubmitVote(Guid roomId, Guid voterId, Guid targetId)
        {
            var room = _roomRepo.Get(roomId);
            room.SubmitVote(voterId, targetId);

            if (!room.AllVotesSubmitted())
            {
                _roomRepo.Save(room);
                return null;
            }

            var result = room.ResolveVotes(); 
            _roomRepo.Save(room);

            return new VoteResultDto
            {
                VotedOutPlayerId = result.VotedOutPlayerId,
                ImpostorWasCaught = result.ImpostorWasCaught
            };
        }

        public RoomDto GetRoom(Guid roomId)
        {
            var room = _roomRepo.Get(roomId);
            return new RoomDto
            {
                Id = room.Id,
                Phase = room.Phase,
                Players = room.Players.Select(p => new PlayerDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    HasVoted = p.HasVoted
                }).ToList()
            };
        }
    }
}
