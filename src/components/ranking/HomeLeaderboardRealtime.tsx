"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type HomeLeaderboardRealtimeProps = {
  /** NEXT_PUBLIC Supabase 설정이 있을 때만 구독 */
  supabaseEnabled: boolean;
};

/**
 * 리뷰 변경 시 서버 컴포넌트를 다시 불러와 랭킹(순위·별점)을 즉시 반영합니다.
 */
export function HomeLeaderboardRealtime({
  supabaseEnabled,
}: HomeLeaderboardRealtimeProps) {
  const router = useRouter();

  useEffect(() => {
    if (!supabaseEnabled) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const channel = supabase
      .channel("home:leaderboard:reviews")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reviews",
        },
        () => {
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabaseEnabled, router]);

  return null;
}
