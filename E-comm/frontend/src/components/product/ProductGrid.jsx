import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../common/Loader';
import EmptyState from '../common/EmptyState';

const ProductGrid = ({ products = [], isLoading = false, columns = 4 }) => {
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  };

  if (isLoading) return <ProductGridSkeleton count={8} />;

  if (!products.length) {
    return (
      <EmptyState
        icon="🔍"
        title="No products found"
        description="Try adjusting your search or filter criteria."
        actionLabel="Browse All Products"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className={`grid ${colClass[columns] || colClass[4]} gap-4`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
