'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Data dummy
const products = [
  { id: 1, name: 'Wireless Headphones', price: 99.99, rating: 4.5, image: '/assets/smartwatch.png', description: 'High-quality wireless headphones with noise-cancelling technology and long battery life.' },
  { id: 2, name: 'Smart Watch', price: 199.99, rating: 4.2, image: '/assets/smartwatch.png', description: 'Feature-packed smartwatch with health tracking, notifications, and customizable watch faces.' },
  { id: 3, name: 'Laptop', price: 999.99, rating: 4.8, image: '/assets/smartwatch.png', description: 'Powerful and lightweight laptop perfect for work and entertainment.' },
  { id: 4, name: 'Smartphone', price: 699.99, rating: 4.6, image: '/assets/smartwatch.png', description: 'Latest smartphone with advanced camera system and 5G capabilities.' },
]

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1)
  const params = useParams()
  const product = products.find(p => p.id === parseInt(params.id))

  if (!product) {
    return <div>Product not found</div>
  }

  const incrementQuantity = () => setQuantity(q => q + 1)
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white">

      <main className="container mx-auto py-8 px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Image 
              src={product.image} 
              alt={product.name} 
              width={400}
              height={400}
              className="w-full h-auto rounded-lg shadow-md"
              priority
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-500' : 'text-gray-300'}`} />
              ))}
              <span className="ml-2 text-gray-600 dark:text-gray-400">{product.rating}</span>
            </div>
            <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
            <p className="mb-6">{product.description}</p>
            <div className="flex items-center mb-6">
              <Button onClick={decrementQuantity} variant="outline" className="px-3">-</Button>
              <span className="mx-4 text-xl">{quantity}</span>
              <Button onClick={incrementQuantity} variant="outline" className="px-3">+</Button>
            </div>
            <Button className="w-full bg-gray-800 dark:bg-white text-white dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-100">
              <ShoppingCart className="mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
