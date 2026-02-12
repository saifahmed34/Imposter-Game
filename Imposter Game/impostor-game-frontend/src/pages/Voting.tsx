import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, parseResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const normalizeId = (id: any) => (id ?? "").toString().trim();

const Voting = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const roomId = sessionStorage.getItem("roomId");
  const playerId = sessionStorage.getItem("playerId");
  const intervalRef = useRef<number | null>(null);
  const isUnmounted = useRef(false);

  useEffect(() => {
    if (!roomId || !playerId) {
      toast.error("No room found. Redirecting...");
      setTimeout(() => navigate("/"), 1000);
      return;
    }

    
    (async () => {
      await loadRoomData();
      
      intervalRef.current = window.setInterval(() => loadRoomData(), 2500);
    })();

    return () => {
      isUnmounted.current = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    
  }, []); 

  const goToResults = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    toast.success("Voting complete! Redirecting to results...");
    
    setTimeout(() => {
      navigate("/results");
    }, 400);
  };

  const loadRoomData = async () => {
    if (!roomId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/Room/${roomId}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await parseResponse(res);
      const room = data.room || data;
      const playersList = room.players || [];
      setPlayers(playersList);

      // Update local voted state for current player from server
      const currentPlayer = playersList.find(
        (p: any) => normalizeId(p.id || p.Id) === normalizeId(playerId)
      );
      if (currentPlayer && currentPlayer.hasVoted) {
        setHasVoted(true);
      }

      const allVoted =
        playersList.length > 0 &&
        playersList.every((p: any) => Boolean(p.hasVoted) === true);

      const phaseValue = (() => {
        const raw = room.phase;
        if (raw === undefined || raw === null) return null;
       
        const n = Number(raw);
        return Number.isNaN(n) ? null : n;
      })();

      if ((phaseValue !== null && phaseValue >= 3) || allVoted) {
        // guard against calling navigation if already unmounted
        if (!isUnmounted.current) goToResults();
      }
    } catch (error) {
      console.error("Error loading room data:", error);
    }
  };

  const submitVote = async () => {
    if (!selectedId) {
      toast.error("Please select a player to vote for");
      return;
    }
    if (!roomId || !playerId) {
      toast.error("Missing room/player id");
      return;
    }
    if (hasVoted) {
      toast.error("You already voted");
      return;
    }

    setLoading(true);
    try {
      // Use the same endpoint/payload your working HTML uses.
      // If your backend expects a different URL, change the URL accordingly.
      const res = await fetch(`${API_BASE_URL}/api/Vote/${roomId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ voterId: playerId, targetId: selectedId }),
      });

      // helpful debugging: if not ok, try to log server text
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Vote error body:", text);
        throw new Error(`HTTP ${res.status}`);
      }

      // Optionally parse response if server returns updated room
      const maybe = await parseResponse(res).catch(() => null);
      // mark local voted state and refresh
      setHasVoted(true);
      setSelectedId(null);
      toast.success("Vote submitted!");

      // If server returned the room or phase, check it immediately
      const returnedRoom = (maybe && (maybe.room || maybe)) || null;
      if (returnedRoom) {
        // if backend signalled finished, navigate now
        const phase = returnedRoom.phase;
        const playersList = returnedRoom.players || [];
        const allVoted =
          playersList.length > 0 && playersList.every((p: any) => Boolean(p.hasVoted) === true);
        if ((phase !== undefined && Number(phase) >= 3) || allVoted) {
          goToResults();
          return;
        }
      }

      // otherwise force-refresh room data (polling will continue too)
      await loadRoomData();
    } catch (error: any) {
      console.error("Failed to submit vote:", error);
      toast.error(`Failed to vote: ${error?.message || "unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const otherPlayers = players.filter((p) => normalizeId(p.id || p.Id) !== normalizeId(playerId));

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">🗳️ Voting</h1>
          <p className="text-muted-foreground">
            {hasVoted ? "Waiting for others to vote..." : "Who do you think is the imposter?"}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          {!hasVoted ? (
            <>
              <div className="space-y-2">
                {otherPlayers.map((p) => {
                  const pId = normalizeId(p.id || p.Id);
                  const name = p.name || p.Name || "Unknown";
                  const isSelected = selectedId === pId;
                  return (
                    <button
                      key={pId}
                      onClick={() => setSelectedId(pId)}
                      className={`w-full text-left px-4 py-3 rounded-md transition-all border ${
                        isSelected
                          ? "bg-imposter/20 border-imposter text-foreground glow-imposter"
                          : "bg-muted border-border text-foreground hover:bg-secondary"
                      }`}
                    >
                      <span className="font-medium">{name}</span>
                    </button>
                  );
                })}
              </div>
              <Button
                onClick={submitVote}
                disabled={!selectedId || loading}
                className="w-full bg-imposter text-imposter-foreground hover:bg-imposter/80 font-semibold"
              >
                {loading ? "Submitting..." : "Submit Vote"}
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4 animate-pulse-glow">⏳</div>
              <p className="text-muted-foreground">Waiting for all players to vote...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Voting;
