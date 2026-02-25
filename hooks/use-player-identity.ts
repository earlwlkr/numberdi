"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "numberdi-player-id";

function generateId(): string {
  return crypto.randomUUID();
}

export function usePlayerIdentity() {
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = generateId();
      localStorage.setItem(STORAGE_KEY, id);
    }
    setPlayerId(id);
  }, []);

  return playerId;
}
