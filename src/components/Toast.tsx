"use client";

import React from "react";

export default function Toast({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed right-6 bottom-6 bg-sky-700 text-white px-4 py-3 rounded-md shadow-lg">
      {message}
    </div>
  );
}
