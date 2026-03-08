"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "numberdi-player-id";

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function usePlayerIdentity() {
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    let id: string | null = null;

    try {
      id = localStorage.getItem(STORAGE_KEY);
      if (!id) {
        id = generateId();
        localStorage.setItem(STORAGE_KEY, id);
      }
    } catch {
      // Private browsing or restricted storage environments should still work.
      id = generateId();
    }

    setPlayerId(id);
  }, []);

  return playerId;
}
