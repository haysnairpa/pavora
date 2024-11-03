import { Button } from "@/components/ui/button";
import Link from 'next/link';

const ProductCard = ({ product }) => {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105">
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-geist font-semibold mb-2">{product.name}</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-800 dark:text-white font-geist font-bold">${product.price.toFixed(2)}</span>
            <span className="text-yellow-500">★ {product.rating}</span>
          </div>
          <Button className="w-full mt-4 bg-gray-800 dark:bg-white text-white dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-100">
            View Details
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 