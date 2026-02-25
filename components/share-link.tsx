"use client";

import { useState } from "react";

export function ShareLink({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const url = `${window.location.origin}/game/${code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 px-4 py-2 rounded-lg bg-white/10 font-mono text-xl tracking-widest text-center">
        {code}
      </div>
      <button
        onClick={handleCopy}
        className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium shrink-0"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
