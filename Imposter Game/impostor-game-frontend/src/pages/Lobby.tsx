import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, parseResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PlayerList from "@/components/PlayerList";

const Lobby = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [phase, setPhase] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
    intervalRef.current = window.setInterval(loadRoomData, 2000);
    loadCategories();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const loadRoomData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Room/${roomId}?playerId=${playerId}`, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await parseResponse(res);
      const room = data.room || data;
      const phaseValue = room.phase ?? 0;
      setPlayers(room.players || []);
      setPhase(phaseValue);
      if (!selectedCategory && room.category)
        setSelectedCategory(room.category);

      // Only navigate to the game view when the room is actively Playing
      // and there are more than 2 players. This avoids looping between
      // lobby and game when players drop to 2 or fewer.
      if (phaseValue === 1) {
        const playerCount = (room.players || []).length;
        if (playerCount > 2) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          toast.success("Game starting...");
          setTimeout(() => navigate("/game"), 500);
        } else {
          // update players state so UI reflects current count
          setPlayers(room.players || []);
        }
      }
    } catch (error) {
      console.error("Error loading room:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Room/categories`, { headers: { Accept: "application/json" } });
      if (!res.ok) return;
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0 && !selectedCategory) setSelectedCategory(data[0]);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const startGame = async (randomize: boolean = false) => {
    try {
      if ((players || []).length <= 2) {
        toast.error("Not enough players to start. Need at least 3 players.");
        return;
      }

      const categoryToUse = randomize ? "" : selectedCategory;

      const res = await fetch(`${API_BASE_URL}/api/Room/${roomId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ category: categoryToUse })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Game started!");
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTimeout(() => navigate("/game"), 500);
    } catch (error: any) {
      toast.error(`Failed to start: ${error.message}`);
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



  const phaseNames = ["Waiting", "Playing", "Voting", "Ended"];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">🎭 Game Lobby</h1>
          <p className="text-muted-foreground">Waiting for players...</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 space-y-5">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Room Information</h3>
            <div className="bg-muted rounded-md p-3 text-center">
              <span className="text-sm text-muted-foreground">Room ID</span>
              <p className="text-xl font-mono font-bold text-primary tracking-widest">{roomId}</p>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Players:</span>
              <span className="text-foreground font-semibold">{players.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phase:</span>
              <span className="text-foreground font-semibold">{phaseNames[phase] || "Unknown"}</span>
            </div>
          </div>

          <PlayerList players={players} currentPlayerId={playerId} />

          <div>
            <label className="text-sm text-muted-foreground">Category</label>
            <select
              value={selectedCategory ?? ""}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full mt-2 p-2 rounded-md border border-border bg-card"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <Button
            onClick={() => startGame(false)}
            disabled={players.length <= 2}
            className="w-full bg-success text-success-foreground hover:bg-success/80 font-semibold"
          >
            Start Game
          </Button>
          <Button
            onClick={() => startGame(true)}
            disabled={players.length <= 2}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/80 font-semibold"
          >
            Randomize Game
          </Button>
          <Button onClick={leaveRoom} variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
            Leave Room
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
