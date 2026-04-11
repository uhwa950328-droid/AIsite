function trimEnv(v: string | undefined): string | undefined {
  const t = v?.trim();
  return t || undefined;
}

/** 클라이언트 번들에 포함되는 공개 URL (insert·Realtime용) */
export function getPublicSupabaseUrl(): string | undefined {
  return trimEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

/** 클라이언트 번들에 포함되는 anon 키 */
export function getPublicSupabaseAnonKey(): string | undefined {
  return trimEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * 서버 전용 조회용. NEXT_PUBLIC_* 외에 SUPABASE_* 만 넣은 배포에서도 동작하도록 함.
 * (브라우저 번들에는 SUPABASE_* 가 없을 수 있음)
 */
export function getServerSupabaseUrl(): string | undefined {
  return getPublicSupabaseUrl() ?? trimEnv(process.env.SUPABASE_URL);
}

export function getServerSupabaseAnonKey(): string | undefined {
  return getPublicSupabaseAnonKey() ?? trimEnv(process.env.SUPABASE_ANON_KEY);
}

/** 클라이언트 insert 가능 여부 — NEXT_PUBLIC 필수 */
export function isSupabaseConfigured(): boolean {
  return Boolean(getPublicSupabaseUrl() && getPublicSupabaseAnonKey());
}
