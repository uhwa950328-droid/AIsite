/** 외부 URL이면 Next/Image 에서 unoptimized 사용 */
export function isRemoteImageSrc(src: string): boolean {
  return /^https?:\/\//i.test(src);
}
