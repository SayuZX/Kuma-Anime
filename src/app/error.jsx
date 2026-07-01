"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/logger";

export default function Error({ error, reset }) {
  useEffect(() => {
    reportError(error, { where: "app/error-boundary", digest: error?.digest });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-2xl font-bold">Terjadi kesalahan</h2>
      <p className="max-w-md text-muted-foreground">
        Maaf, bagian ini gagal dimuat. Coba muat ulang
      </p>
      <button
        onClick={() => reset()}
        className="rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Coba Lagi
      </button>
    </div>
  );
}
