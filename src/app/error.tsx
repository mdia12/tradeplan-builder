"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
      <h2 className="text-2xl font-bold mb-4">Une erreur est survenue !</h2>
      <p className="text-red-400 mb-4">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
      >
        Réessayer
      </button>
    </div>
  );
}
