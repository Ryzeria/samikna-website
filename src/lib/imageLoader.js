// lib/imageLoader.js
// Custom image loader for static export

export default function imageLoader({ src, width, quality }) {
  // For static export, return the original image URL
  if (src.startsWith('http') || src.startsWith('//')) {
    return src;
  }
  
  // For local images, just return the src as-is
  return src;
}