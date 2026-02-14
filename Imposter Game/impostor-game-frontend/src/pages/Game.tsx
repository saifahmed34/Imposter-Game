import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, parseResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PlayerList from "@/components/PlayerList";

const Game = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [role, setRole] = useState<"imposter" | "civilian" | null>(null);
  const [word, setWord] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const roomId = sessionStorage.getItem("roomId");
  const playerId = sessionStorage.getItem("playerId");
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!roomId || !playerId) {
      toast.error("No room found. Redirecting...");
      setTimeout(() => navigate("/"), 1000);
      return;
    }
    loadRoomData();
    intervalRef.current = window.setInterval(loadRoomData, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const loadRoomData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Room/${roomId}`, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await parseResponse(res);
      const room = data.room || data;
      const pls = room.players || [];
      setPlayers(pls);

      if (!loaded) {
        const me = pls.find((p: any) => p.id === playerId);
        if (me) {
          const isImp = me.isImposter === true;
          setRole(isImp ? "imposter" : "civilian");
          setWord(isImp ? null : me.word || null);
          setLoaded(true);
        }
      }

      if (room.phase && room.phase >= 2) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        toast.success("Voting phase started...");
        setTimeout(() => navigate("/voting"), 500);
      }
    } catch (error) {
      console.error("Error loading game:", error);
    }
  };

  const startVoting = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Room/${roomId}/start-vote`, { method: "POST", headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Voting started!");
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTimeout(() => navigate("/voting"), 500);
    } catch (error: any) {
      toast.error(`Failed to start voting: ${error.message}`);
    }
  };

const leaveRoom = async () => {
  try {
    const roomId = sessionStorage.getItem("roomId");
    const playerId = sessionStorage.getItem("playerId");

    if (!roomId || !playerId) return;

    await leaveRoomApi(roomId, playerId);

    if (intervalRef.current) clearInterval(intervalRef.current);

    sessionStorage.clear();
    navigate("/");
  } catch (err) {
    console.error("Error leaving room:", err);
  }
};


   async function leaveRoomApi(roomId: string, playerId: string) {
  await fetch(`${API_BASE_URL}/api/Room/${roomId}/leave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      playerId: playerId
    })
  });
}
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">🎭 Game In Progress</h1>
          <p className="text-muted-foreground">Discuss and find the imposter!</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 space-y-5">
          {/* Role Display */}
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Your Information</h3>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Your Role</span>
              {role === "imposter" ? (
                <div className="mt-1 inline-block bg-imposter text-imposter-foreground px-4 py-2 rounded-lg font-bold text-lg glow-imposter">
                  IMPOSTER
                </div>
              ) : role === "civilian" ? (
                <div className="mt-1 inline-block bg-civilian text-civilian-foreground px-4 py-2 rounded-lg font-bold text-lg glow-success">
                  CIVILIAN
                </div>
              ) : (
                <div className="mt-1 text-muted-foreground animate-pulse-glow">Loading...</div>
              )}
            </div>

            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Your Word</span>
              <p className="text-2xl font-bold font-mono text-primary mt-1">
                {role === "imposter" ? "???" : word || "Loading..."}
              </p>
            </div>

            {role === "imposter" && (
              <div className="bg-imposter/10 border border-imposter/30 rounded-md p-3 text-sm text-foreground">
                <strong>⚠️ You are the IMPOSTER!</strong>
                <br />
                You don't know the secret word. Try to blend in!
              </div>
            )}
            {role === "civilian" && word && (
              <div className="bg-civilian/10 border border-civilian/30 rounded-md p-3 text-sm text-foreground">
                <strong>✓ You are a CIVILIAN!</strong>
                <br />
                Your secret word is: <strong className="text-primary">{word}</strong>
                <br />
                Find the imposter who doesn't know this word!
              </div>
            )}
          </div>

          <PlayerList players={players} currentPlayerId={playerId} />

          <Button onClick={startVoting} className="w-full bg-primary text-primary-foreground hover:bg-primary/80 font-semibold">
            Start Voting Phase
          </Button>
          <Button onClick={leaveRoom} variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
            Leave Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Game;
