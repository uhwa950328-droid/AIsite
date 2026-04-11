/** @type {import('next').NextConfig} */
const nextConfig = {
  // 서버 전용 external 대신 transpile — 클라이언트(ReviewPanel)와 서버 모두에서 모듈이 깨지지 않게 함
  transpilePackages: ["@supabase/supabase-js"],
};

export default nextConfig;
