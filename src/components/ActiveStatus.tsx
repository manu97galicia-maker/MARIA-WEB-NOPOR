"use client";

import { useState, useEffect } from "react";

export default function ActiveStatus() {
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    // Random between 1 and 15 minutes on mount
    setMinutes(Math.floor(Math.random() * 15) + 1);
  }, []);

  if (minutes === 0) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      Activa hace {minutes} min
    </div>
  );
}
