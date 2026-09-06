import { motion } from 'framer-motion';

// Spinner Loader
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} ${className} border-4 border-gray-200 border-t-navy rounded-full animate-spin`} />
  );
};

// Full Page Loader
export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Spinner size="lg" className="mx-auto mb-4" />
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  </div>
);

// Skeleton Box
export const SkeletonBox = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

// Product Card Skeleton
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-card p-4">
    <SkeletonBox className="w-full h-48 rounded-lg mb-4" />
    <SkeletonBox className="h-4 w-3/4 mb-2" />
    <SkeletonBox className="h-3 w-1/2 mb-3" />
    <SkeletonBox className="h-6 w-1/3" />
  </div>
);

// Grid Skeleton
export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

const Loader = ({ type = 'spinner', count = 8 }) => {
  if (type === 'page') return <PageLoader />;
  if (type === 'grid') return <ProductGridSkeleton count={count} />;
  return <Spinner />;
};

export default Loader;
