"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-zinc-950 text-zinc-100 antialiased">
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
          <h2 className="text-lg font-semibold">심각한 오류</h2>
          <p className="max-w-md text-sm text-zinc-400">{error.message}</p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
