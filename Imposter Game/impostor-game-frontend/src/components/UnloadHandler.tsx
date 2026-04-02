import { useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";

const UnloadHandler = () => {
  useEffect(() => {
    const sendLeave = () => {
      const roomId = sessionStorage.getItem("roomId");
      const playerId = sessionStorage.getItem("playerId");
      if (!roomId || !playerId) return;

      const url = `${API_BASE_URL}/api/Room/${roomId}/leave`;
      const body = JSON.stringify({ playerId });

      if (navigator && typeof navigator.sendBeacon === "function") {
        const blob = new Blob([body], { type: "application/json" });
        try {
          navigator.sendBeacon(url, blob);
        } catch (e) {
          // ignore
        }
      } else {
        // fallback: synchronous XHR (best-effort during unload)
        try {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", url, false);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(body);
        } catch (e) {
          // ignore
        }
      }
    };

    const onBeforeUnload = () => sendLeave();
    const onPageHide = () => sendLeave();

    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, []);

  return null;
};

export default UnloadHandler;
