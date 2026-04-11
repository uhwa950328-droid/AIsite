import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getServerSupabaseAnonKey,
  getServerSupabaseUrl,
} from "@/lib/supabase/env";

function createServerSupabaseClient(): SupabaseClient {
  const url = getServerSupabaseUrl()!;
  const key = getServerSupabaseAnonKey()!;
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * 요청마다 새 클라이언트를 쓰면 env·세션 꼬임을 줄일 수 있습니다.
 * (서버 컴포넌트에서 공유 싱글톤은 드물게 오래된 상태를 참조할 수 있음)
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  const url = getServerSupabaseUrl();
  const key = getServerSupabaseAnonKey();
  if (!url || !key) return null;
  return createServerSupabaseClient();
}
