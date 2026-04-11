using ImposterGame.Application.DTOs;
using ImposterGame.Application.Interfaces.Repositories;
using ImposterGame.Application.Interfaces.Services;
using ImposterGame.Domain.Entites;
using ImposterGame.Domain.Enums;

namespace ImposterGame.Application.Services
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
            _roomRepo.Add(room);
            _roomRepo.SaveChanges();
            return room.Id;
        }

        public void JoinRoom(Guid roomId, string playerName)
        {
            var room = _roomRepo.GetWithPlayers(roomId);
            if (room == null)
                throw new KeyNotFoundException("Room not found");

            var player = new Player(playerName);
            room.AddPlayer(player);

            _roomRepo.SaveChanges(); // ✔️ بس كده
        }
        // public void StartGame(Guid roomId)
        // {
        //     var room = _roomRepo.GetWithPlayers(roomId);
        //     if (room == null)
        //         throw new KeyNotFoundException("Room not found");
        //     // Get a random word for this game
        //     var word = _wordProvider.GetRandomWord();

        //     // Start the game with the word
        //     room.StartGame(word);

        //     _roomRepo.Update(room);
        //     _roomRepo.SaveChanges();
        // }

        public void StartGame(Guid roomId, string category)
        {
            var room = _roomRepo.GetWithPlayers(roomId);
            if (room == null)
                throw new KeyNotFoundException("Room not found");

            // store selected category on room
            room.Category = category;

            // Get a random word for this game from the selected category
            var word = _wordProvider.GetRandomWord(category);

            // Start the game with the word
            room.StartGame(word);

            _roomRepo.Update(room);
            _roomRepo.SaveChanges();
        }

        public void BeginVoting(Guid roomId)
        {
            var room = _roomRepo.GetWithPlayers(roomId);
            if (room == null)
                throw new KeyNotFoundException("Room not found");

            room.BeginVoting();

            _roomRepo.Update(room);
            _roomRepo.SaveChanges();
        }

        public void ResetRoom(Guid roomId)
        {
            var room = _roomRepo.GetWithPlayers(roomId);
            if (room == null)
                throw new KeyNotFoundException("Room not found");

            room.ResetRoom();

            _roomRepo.Update(room);
            _roomRepo.SaveChanges();
        }

        public VoteResultDto SubmitVote(Guid roomId, Guid voterId, Guid targetId)
        {
            var room = _roomRepo.GetWithPlayers(roomId);
            if (room == null)
                throw new KeyNotFoundException("Room not found");

            room.SubmitVote(voterId, targetId);
            //  _roomRepo.Update(room);
            _roomRepo.SaveChanges();

            if (!room.AllVotesSubmitted())
                return null;

            var result = room.ResolveVotes();
            //  _roomRepo.Update(room);
            _roomRepo.SaveChanges();

            return new VoteResultDto
            {
                VotedOutPlayerId = result.Item1,
                ImpostorWasCaught = result.Item2
            };
        }

        public RoomDto GetRoom(Guid roomId, Guid? playerId = null)
        {
            var room = _roomRepo.GetWithPlayers(roomId);
            if (room == null)
                throw new KeyNotFoundException("Room not found");

            var isFinished = room.Phase == GamePhase.Finished;

            var dto = new RoomDto
            {
                Id = room.Id,
                Category = room.Category,
                Phase = room.Phase,
                Players = room.Players.Select(p => new PlayerDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    HasVoted = p.HasVoted,
                    // Only reveal imposter identity after the game is finished
                    IsImposter = isFinished ? p.IsImposter : null
                }).ToList()
            };

            // Only attach role info for the specific requesting player
            if (playerId.HasValue)
            {
                var me = room.Players.FirstOrDefault(p => p.Id == playerId.Value);
                if (me != null)
                {
                    dto.MyRole = new MyRoleDto
                    {
                        IsImposter = me.IsImposter,
                        Word = me.Word
                    };
                }
            }

            return dto;
        }

        public void LeaveRoom(Guid roomid, Guid playerId)
        {
            var player = _roomRepo.GetPlayer(playerId);
            if (player == null)
                return;

            var room = _roomRepo.GetWithPlayers(player.RoomId);
            if (room == null)
                return;

            room.RemovePlayer(playerId);
            _roomRepo.Update(room);
            _roomRepo.SaveChanges();
        }
    }
}