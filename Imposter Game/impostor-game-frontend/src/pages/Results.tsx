import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, parseResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PlayerList from "@/components/PlayerList";

const Results = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ title: string; message: string; type: "win" | "lose" | "draw" } | null>(null);
  const navigate = useNavigate();
  const roomId = sessionStorage.getItem("roomId");
  const playerId = sessionStorage.getItem("playerId");

  useEffect(() => {
    if (!roomId || !playerId) {
      toast.error("Redirecting...");
      setTimeout(() => navigate("/"), 1000);
      return;
    }
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Room/${roomId}`, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await parseResponse(res);
      const room = data.room || data;
      const votes = data.votes || room.votes || [];
      const pls = room.players || [];
      setPlayers(pls);

      const counts: Record<string, number> = {};
      votes.forEach((v: any) => {
        const tId = (v.targetId || v.TargetId || "").toString().trim();
        if (tId) counts[tId] = (counts[tId] || 0) + 1;
      });
      setVoteCounts(counts);

      const imposter = pls.find((p: any) => p.isImposter === true || p.IsImposter === true);
      if (imposter) {
        const impId = (imposter.id || imposter.Id || "").toString().trim();
        const vAgainst = counts[impId] || 0;
        let vOthers = 0;
        Object.entries(counts).forEach(([id, c]) => { if (id !== impId) vOthers += c; });
        const impName = imposter.name || imposter.Name;

        if (vAgainst > vOthers) {
          setResult({ title: "🎉 Civilians Win!", message: `The imposter ${impName} was caught with ${vAgainst} votes!`, type: "win" });
        } else if (vAgainst < vOthers) {
          setResult({ title: "😈 Imposter Wins!", message: `The imposter ${impName} escaped! Civilians received more votes.`, type: "lose" });
        } else {
          setResult({ title: "⚖️ It's a Draw!", message: "The votes are tied! No clear decision.", type: "draw" });
        }
      }
    } catch (error: any) {
      toast.error(`Error loading results: ${error.message}`);
    }
  };

  const resultStyles = {
    win: "bg-civilian/15 border-civilian/40 text-foreground",
    lose: "bg-imposter/15 border-imposter/40 text-foreground",
    draw: "bg-warning/15 border-warning/40 text-foreground",
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">🎭 Game Results</h1>
          <p className="text-muted-foreground">Who was the imposter?</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 space-y-5">
          {result && (
            <div className={`rounded-lg border p-5 text-center ${resultStyles[result.type]}`}>
              <h2 className="text-2xl font-bold mb-2">{result.title}</h2>
              <p className="text-sm">{result.message}</p>
            </div>
          )}

          <PlayerList players={players} currentPlayerId={playerId} voteCounts={voteCounts} showImposter />

          <Button onClick={() => { sessionStorage.removeItem("roomId"); navigate("/"); }} className="w-full bg-primary text-primary-foreground hover:bg-primary/80 font-semibold">
            Play Again
          </Button>
          <Button onClick={() => { sessionStorage.clear(); navigate("/"); }} variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
