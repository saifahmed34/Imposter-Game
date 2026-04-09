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

      // Determine the single top-voted player. If single top exists and is impostor => civilians win.
      // Otherwise impostor wins. Ties or no votes count as impostor win.
      const entries = Object.entries(counts);
      if (entries.length === 0) {
        setResult({ title: "😈 Imposter Wins!", message: "No votes were cast. Imposter wins.", type: "lose" });
      } else {
        const maxCount = Math.max(...entries.map(([_, c]) => c));
        const top = entries.filter(([_, c]) => c === maxCount);
        if (top.length !== 1) {
          // tie for top votes
          setResult({ title: "⚖️ It's a Draw!", message: "The votes are tied! No clear decision. Imposter wins.", type: "draw" });
        } else {
          const topId = top[0][0];
          const votedOut = pls.find((p: any) => ((p.id || p.Id) || "").toString().trim() === topId);
          if (!votedOut) {
            setResult({ title: "😈 Imposter Wins!", message: "Could not determine voted player. Imposter wins.", type: "lose" });
          } else {
            const isImposter = Boolean(votedOut.isImposter || votedOut.IsImposter);
            const name = votedOut.name || votedOut.Name || "Unknown";
            if (isImposter) {
              setResult({ title: "🎉 Civilians Win!", message: `The imposter ${name} was caught with ${maxCount} votes!`, type: "win" });
            } else {
              setResult({ title: "😈 Imposter Wins!", message: `Players voted out ${name} (not the imposter). Imposter wins!`, type: "lose" });
            }
          }
        }
      }
    } catch (error: any) {
      toast.error(`Error loading results: ${error.message}`);
    }
  };

  const playAgain = async () => {
    try {
      if (!roomId) throw new Error("No roomId available");
      // Reset room on the server so it returns to Waiting and new players can join.
      const res = await fetch(`${API_BASE_URL}/api/Room/${roomId}/reset`, { method: "POST", headers: { Accept: "application/json" } });
      if (!res.ok) {
        const err = await parseResponse(res).catch(() => null);
        throw new Error(err?.message || `HTTP ${res.status}`);
      }
      toast.success("Room reset. Returning to lobby.");
      navigate("/lobby");
    } catch (error: any) {
      toast.error(`Failed to go to lobby: ${error?.message || error}`);
    }
  };

  const resultStyles = {
    win: "bg-civilian/15 border-civilian/40 text-foreground",
    lose: "bg-imposter/15 border-imposter/40 text-foreground",
    draw: "bg-warning/15 border-warning/40 text-foreground",
  };

  const leaveAndGoHome = async () => {
    try {
      if (!roomId || !playerId) {
        sessionStorage.clear();
        navigate("/");
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/Room/${roomId}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ playerId }),
      });
      if (!res.ok) {
        const err = await parseResponse(res);
        throw new Error(err?.message || `HTTP ${res.status}`);
      }
      toast.success("Left room");
    } catch (error: any) {
      toast.error(`Failed to leave room: ${error?.message || error}`);
    } finally {
      sessionStorage.clear();
      navigate("/");
    }
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

          <Button onClick={playAgain} className="w-full bg-primary text-primary-foreground hover:bg-primary/80 font-semibold">
            Play Again
          </Button>
          <Button onClick={leaveAndGoHome} variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
