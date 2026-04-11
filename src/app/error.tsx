"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-zinc-950 p-6 text-center text-zinc-100">
      <h2 className="text-lg font-semibold">문제가 발생했습니다</h2>
      <p className="max-w-md text-sm text-zinc-400">{error.message}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
      >
        다시 시도
      </button>
    </div>
  );
}
