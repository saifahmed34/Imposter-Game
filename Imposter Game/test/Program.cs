//quick Testing in console app for ImposterGame domain logic

using ImposterGame.Domain.Entites;
using ImpostorGame.Domain.Entities;
using System.Numerics;

var room = new GameRoom();

room.AddPlayer(new Player("A"));
room.AddPlayer(new Player("B"));
room.AddPlayer(new Player("C"));
room.AddPlayer(new Player("D"));

room.StartGame("Apple");

foreach (var player in room.Players)
{
    Console.WriteLine($"{player.Name}: Impostor = {player.IsImpostor}");
}

room.BeginVoting();

var target = room.Players[3];

foreach (var player in room.Players)
{
    room.SubmitVote(player.Id, target.Id);
}

var playersWin = room.ResolveVotes();
Console.WriteLine(playersWin);
