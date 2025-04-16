// components/DisconnectHandler.tsx
"use client";

import { useEffect } from "react";

export default function DisconnectHandler() {
  useEffect(() => {
    const handleDisconnect = () => {
      navigator.sendBeacon("/api/disconnect");
    };

    window.addEventListener("beforeunload", handleDisconnect);
    window.addEventListener("pagehide", handleDisconnect); // for mobile browser support

    return () => {
      window.removeEventListener("beforeunload", handleDisconnect);
      window.removeEventListener("pagehide", handleDisconnect);
    };
  }, []);


  useEffect(() => {
    const setAvailable = async () => {
      await fetch ("/api/set-available", { method: "PATCH" });
    }
    setAvailable();
  }, []);

  return null; // No need to render anything
}
