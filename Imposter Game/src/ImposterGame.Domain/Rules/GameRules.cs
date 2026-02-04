using System;
using System.Collections.Generic;
using System.Text;

namespace ImposterGame.Domain.Rules
{
    public class GameRules
    {
        public const int MinPlayers = 4;
        public const int MaxPlayers = 8;

        public static bool CanStartGame(int playerCount)
         => playerCount >= MinPlayers && playerCount <= MaxPlayers;
    }
}
