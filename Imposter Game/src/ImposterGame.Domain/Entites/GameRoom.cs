using System;
using System.Collections.Generic;
using System.Linq;
using ImposterGame.Domain.Entites;
using ImposterGame.Domain.Enums;
using ImposterGame.Domain.Rules;

namespace ImposterGame.Domain.Entites
{
    public class GameRoom
    {
        public Guid Id { get; set; }
        public GamePhase Phase { get; set; } = GamePhase.Waiting;

        // EF-friendly
        public List<Player> Players { get; set; } = new();
        public List<Vote> Votes { get; set; } = new();

        public GameRoom()
        {
            Id = Guid.NewGuid();
        }

        public void AddPlayer(Player player)
        {
            if (Phase != GamePhase.Waiting)
                throw new InvalidOperationException("Game already started");

            player.RoomId = Id;
            Players.Add(player);
        }

        public void StartGame(string word)
        {
            if (!GameRules.CanStartGame(Players.Count))
                throw new InvalidOperationException("Invalid player count");

            Phase = GamePhase.Playing;

            // Pick random imposter
            var impostorIndex = Random.Shared.Next(Players.Count);

            // Assign roles and words to all players
            for (int i = 0; i < Players.Count; i++)
            {
                if (i == impostorIndex)
                {
                    // This player is the imposter
                    Players[i].IsImposter = true;
                    Players[i].Word = null; // Imposter doesn't know the word
                }
                else
                {
                    // Regular civilian
                    Players[i].IsImposter = false;
                    Players[i].Word = word; // All civilians get the same word
                }
            }
        }

        public void BeginVoting()
        {
            Phase = GamePhase.Voting;
            Votes.Clear();

            foreach (var p in Players)
                p.ResetVote();
        }

        public void SubmitVote(Guid voterId, Guid targetId)
        {
            if (Votes.Any(v => v.VoterId == voterId))
                throw new InvalidOperationException("Already voted");

            Votes.Add(new Vote(voterId, targetId));
            Players.Single(p => p.Id == voterId).HasVoted = true;
        }

        public bool AllVotesSubmitted()
            => Players.All(p => p.HasVoted);

        public (Guid, bool) ResolveVotes()
        {
            var winner = Votes
                .GroupBy(v => v.TargetId)
                .OrderByDescending(g => g.Count())
                .First();

            Phase = GamePhase.Finished;

            var votedOut = Players.Single(p => p.Id == winner.Key);
            return (votedOut.Id, votedOut.IsImposter);
        }

        public void RemovePlayer(Guid playerId)
        {
            var player = Players.SingleOrDefault(p => p.Id == playerId);
            if (player != null)
                Players.Remove(player);
        }
    }
}
