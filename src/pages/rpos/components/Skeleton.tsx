import { FC } from 'react';

/**
 * Skeleton Loader Component - Shows loading placeholder
 * Benefits:
 * - Better perceived performance
 * - Reduces layout shift
 * - Smooth loading experience
 */

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'button' | 'card';
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

export const Skeleton: FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 w-full rounded';
      case 'rectangular':
        return 'rounded-md';
      case 'circular':
        return 'rounded-full';
      case 'button':
        return 'h-10 rounded-md';
      case 'card':
        return 'h-32 rounded-lg';
      default:
        return 'rounded';
    }
  };

  const skeletonItem = (
    <div
      className={`animate-pulse bg-gray-200 ${getVariantClasses()} ${className}`}
      style={{
        width: width || (variant === 'circular' ? '40px' : undefined),
        height: height || (variant === 'circular' ? '40px' : undefined),
      }}
    />
  );

  if (count === 1) {
    return skeletonItem;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{skeletonItem}</div>
      ))}
    </div>
  );
};

/**
 * Product Grid Skeleton
 */
export const ProductGridSkeleton: FC<{ count?: number }> = ({ count = 12 }) => (
  <div className="grid grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="p-4 bg-white shadow rounded-md">
        <Skeleton variant="rectangular" height="80px" className="mb-2" />
        <Skeleton variant="text" className="mb-1" />
        <Skeleton variant="text" width="60%" />
      </div>
    ))}
  </div>
);

/**
 * Order Items Table Skeleton
 */
export const OrderTableSkeleton: FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4">
        <Skeleton variant="circular" width="24px" height="24px" />
        <Skeleton variant="text" className="flex-1" />
        <Skeleton variant="text" width="60px" />
        <Skeleton variant="text" width="80px" />
      </div>
    ))}
  </div>
);

/**
 * Category Sidebar Skeleton
 */
export const CategorySidebarSkeleton: FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="space-y-2 p-2">
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} variant="button" />
    ))}
  </div>
);
