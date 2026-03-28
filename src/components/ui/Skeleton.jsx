import React, { memo } from 'react';

/**
 * Primitive animated placeholder — pulse effect via Tailwind.
 * All variants compose from this single base element.
 */
const Skeleton = memo(function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-hidden="true"
    />
  );
});

/** Single line of text (full-width by default). */
export const SkeletonLine = memo(function SkeletonLine({ className = '' }) {
  return <Skeleton className={`h-4 w-full rounded-md ${className}`} />;
});

/** Rectangular block — use for images, charts, avatars, etc. */
export const SkeletonBox = memo(function SkeletonBox({ className = '' }) {
  return <Skeleton className={`rounded-xl ${className}`} />;
});

/** Circular avatar placeholder. */
export const SkeletonAvatar = memo(function SkeletonAvatar({ size = 'md' }) {
  const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };
  return <Skeleton className={`${sizes[size] ?? sizes.md} rounded-full flex-shrink-0`} />;
});

/**
 * Generic card skeleton.
 * Renders an icon placeholder, two text lines, and an optional wider line.
 */
export const SkeletonCard = memo(function SkeletonCard({ className = '', lines = 2 }) {
  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4 ${className}`}
      aria-hidden="true"
    >
      {/* Header row */}
      <div className="flex items-center gap-3">
        <SkeletonAvatar size="md" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="w-2/3" />
          <SkeletonLine className="w-1/3 h-3" />
        </div>
      </div>

      {/* Body lines */}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine
            key={i}
            className={i === lines - 1 ? 'w-3/4' : 'w-full'}
          />
        ))}
      </div>
    </div>
  );
});

/**
 * Stat / metric card skeleton — matches the 4-column metric cards in the
 * crop-management and dashboard pages.
 */
export const SkeletonMetricCard = memo(function SkeletonMetricCard({ className = '' }) {
  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between mb-4">
        <SkeletonBox className="w-12 h-12" />
        <SkeletonLine className="w-20 h-5" />
      </div>
      <div className="space-y-2">
        <SkeletonLine className="w-1/2 h-3" />
        <SkeletonLine className="w-1/3 h-7" />
      </div>
    </div>
  );
});

/**
 * Table-row skeleton — use inside a list or table body.
 * `cols` controls how many column placeholders to render.
 */
export const SkeletonRow = memo(function SkeletonRow({ cols = 4, className = '' }) {
  return (
    <div className={`flex items-center gap-4 py-3 ${className}`} aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonLine key={i} className={i === 0 ? 'w-1/4' : 'flex-1'} />
      ))}
    </div>
  );
});

export default Skeleton;
