/**
 * SafeImage — drop-in <img> replacement with automatic onError fallback.
 *
 * Why not Next.js <Image>?
 *   next/image requires width+height or the `fill` prop, and forces domain
 *   configuration for all external URLs. Profile pictures, partner logos, and
 *   other dynamic URLs don't always satisfy those constraints, so we wrap the
 *   native <img> element here and handle failures gracefully.
 *
 * Usage:
 *   <SafeImage src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
 *   <SafeImage src={logo} alt="Partner" fallbackSrc="/images/placeholder-logo.png" />
 */

import React, { useState, useCallback } from 'react';

// Inline SVG placeholder — zero external dependency, renders instantly.
// Shows a neutral person silhouette on a light-gray background.
const FALLBACK_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E" +
  "%3Crect width='100' height='100' fill='%23e5e7eb'/%3E" +
  "%3Ccircle cx='50' cy='36' r='18' fill='%23d1d5db'/%3E" +
  "%3Cellipse cx='50' cy='82' rx='28' ry='20' fill='%23d1d5db'/%3E" +
  "%3C/svg%3E";

/**
 * @param {object}  props
 * @param {string}  props.src           — Primary image URL.
 * @param {string}  [props.alt]         — Alt text (required for accessibility).
 * @param {string}  [props.fallbackSrc] — URL shown when src fails. Defaults to built-in SVG.
 * @param {string}  [props.className]   — Tailwind / custom classes forwarded to <img>.
 * @param {function}[props.onError]     — Optional external onError handler.
 */
export default function SafeImage({
  src,
  alt = '',
  fallbackSrc,
  className = '',
  onError,
  ...rest
}) {
  const resolvedFallback = fallbackSrc || FALLBACK_DATA_URI;

  // Initialise with src; if src is falsy, go straight to the fallback.
  const [imgSrc, setImgSrc] = useState(src || resolvedFallback);
  const [didError, setDidError] = useState(false);

  const handleError = useCallback(
    (e) => {
      // Prevent infinite loop if the fallback itself is broken.
      if (!didError) {
        setDidError(true);
        setImgSrc(resolvedFallback);
      }
      onError?.(e);
    },
    [didError, resolvedFallback, onError],
  );

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...rest}
    />
  );
}
