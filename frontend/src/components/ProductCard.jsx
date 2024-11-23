import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Button } from './ui/button';

export default function ProductCard({ id, name, price, image, rating, stock }) {
  const rupiahFormat = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(number);
  };

  return (
    <Link href={`/product/${id}`}>
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className="relative aspect-square">
          <Image
            src={image ? `data:image/jpeg;base64,${image}` : '/assets/smartwatch.png'}
            alt={name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white line-clamp-2">
            {name}
          </h3>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between items-center mt-auto">
            <p className="text-lg font-bold text-gray-800 dark:text-white">
              {rupiahFormat(price)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Stock: {stock}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}