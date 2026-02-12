import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, parseResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Join = () => {
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const joinRoom = async () => {
    const playerName = localStorage.getItem("playerName") || sessionStorage.getItem("playerName");
    if (!playerName) {
      toast.error("Player name not found. Redirecting...");
      setTimeout(() => navigate("/"), 1000);
      return;
    }
    if (!roomCode.trim()) {
      toast.error("Please enter a room code");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/Room/${roomCode.trim()}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ playerName }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await parseResponse(response);
      const playerId = data.playerId || data.id || data;
      sessionStorage.setItem("roomId", roomCode.trim());
      sessionStorage.setItem("playerId", playerId);
      sessionStorage.setItem("playerName", playerName);
      toast.success("Joined successfully!");
      navigate("/lobby");
    } catch (error: any) {
      toast.error(`Failed to join room: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">🎭 Join Room</h1>
          <p className="text-muted-foreground">Enter the room code to join</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Room Code</label>
            <Input
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Enter room ID"
              className="bg-muted border-border font-mono text-lg tracking-wider"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && joinRoom()}
            />
          </div>
          <Button onClick={joinRoom} disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/80 font-semibold">
            {loading ? "Joining..." : "Join Room"}
          </Button>
          <Button onClick={() => navigate("/")} variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Join;
