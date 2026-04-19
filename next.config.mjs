/** @type {import('next').NextConfig} */
const nextConfig = {
  // @supabase/supabase-js 를 transpile하면 서버 청크 경로와 webpack-runtime의 require 경로가
  // 어긋나 dev/build 시 Cannot find module './NNN.js' 가 난다. 기본 번들로 충분하다.
};

export default nextConfig;
