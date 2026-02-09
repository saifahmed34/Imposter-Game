namespace ImposterGame.Domain.Rules
{
    public static class GameRules
    {
        public const int MinPlayers = 2;
        public const int MaxPlayers = 10;

        public static bool CanStartGame(int playerCount)
        {
            return playerCount >= MinPlayers && playerCount <= MaxPlayers;
        }
    }
}
