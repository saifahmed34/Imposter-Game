import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, parseResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PlayerList from "@/components/PlayerList";

const Lobby = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [phase, setPhase] = useState(0);
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
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const loadRoomData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Room/${roomId}`, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await parseResponse(res);
      const room = data.room || data;
      setPlayers(room.players || []);
      setPhase(room.phase || 0);
      if (room.phase && room.phase > 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        toast.success("Game starting...");
        setTimeout(() => navigate("/game"), 500);
      }
    } catch (error) {
      console.error("Error loading room:", error);
    }
  };

  const startGame = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Room/${roomId}/start`, { method: "POST", headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Game started!");
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTimeout(() => navigate("/game"), 500);
    } catch (error: any) {
      toast.error(`Failed to start: ${error.message}`);
    }
  };

  const leaveRoom = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    sessionStorage.clear();
    navigate("/");
  };

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

          <Button onClick={startGame} disabled={players.length < 2} className="w-full bg-success text-success-foreground hover:bg-success/80 font-semibold">
            Start Game
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
