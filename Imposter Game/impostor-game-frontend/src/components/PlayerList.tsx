interface PlayerListProps {
  players: any[];
  currentPlayerId: string | null;
  voteCounts?: Record<string, number>;
  showImposter?: boolean;
}

const PlayerList = ({ players, currentPlayerId, voteCounts, showImposter }: PlayerListProps) => {
  if (players.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-2">No players yet...</p>;
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Players</h4>
      <div className="space-y-1">
        {players.map((p) => {
          const pId = (p.id || p.Id || "").toString().trim();
          const name = p.name || p.Name || "Unknown";
          const isImp = p.isImposter === true || p.IsImposter === true;
          const count = voteCounts ? voteCounts[pId] || 0 : null;

          return (
            <div
              key={pId}
              className="flex items-center justify-between bg-muted rounded-md px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-foreground text-sm">{name}</span>
                {pId === currentPlayerId && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">You</span>
                )}
                {showImposter && isImp && (
                  <span className="text-xs bg-imposter text-imposter-foreground px-2 py-0.5 rounded-full font-medium">IMPOSTER</span>
                )}
              </div>
              {count !== null && (
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-mono">
                  {count} {count === 1 ? "vote" : "votes"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerList;
