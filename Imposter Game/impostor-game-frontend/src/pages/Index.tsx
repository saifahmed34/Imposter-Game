import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, parseResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Index = () => {
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("playerName");
    if (saved) setPlayerName(saved);
    inputRef.current?.focus();
  }, []);

  const createRoom = useCallback(async () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/room`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await parseResponse(response);
      const roomId = data.room?.id || data.roomId || data.id || data;
      localStorage.setItem("playerName", playerName.trim());

      // Auto-join
      const joinRes = await fetch(`${API_BASE_URL}/api/room/${roomId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ playerName: playerName.trim() }),
      });
      if (!joinRes.ok) throw new Error(`HTTP error! status: ${joinRes.status}`);
      const joinData = await parseResponse(joinRes);
      const playerId = joinData.playerId || joinData.id || joinData;

      sessionStorage.setItem("roomId", roomId);
      sessionStorage.setItem("playerId", playerId);
      sessionStorage.setItem("playerName", playerName.trim());
      toast.success("Room created!");
      navigate("/lobby");
    } catch (error: any) {
      toast.error(`Failed to create room: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [playerName, navigate]);

  const goToJoin = () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name first");
      return;
    }
    localStorage.setItem("playerName", playerName.trim());
    navigate("/join");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">
            <span className="text-glow">😈</span>
          </h1>
          <h2 className="text-3xl font-bold text-foreground mb-2">Imposter Game</h2>
          <p className="text-muted-foreground">Find the imposter among us!</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4 glow-primary">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Enter Your Name
            </label>
            <Input
              ref={inputRef}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              className="bg-muted border-border"
              onKeyDown={(e) => e.key === "Enter" && createRoom()}
            />
          </div>

          <Button
            onClick={createRoom}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/80 font-semibold"
          >
            {loading ? "Creating..." : "Create New Room"}
          </Button>
          <Button
            onClick={goToJoin}
            variant="outline"
            className="w-full border-border text-foreground hover:bg-secondary"
          >
            Join Existing Room
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
