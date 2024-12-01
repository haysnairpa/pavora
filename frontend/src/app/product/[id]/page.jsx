'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ProductDetail() {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:5000/products/products/${params.id}`)
      if (!res.ok) throw new Error('Product not found')
      const data = await res.json()
      if (!data.product) throw new Error('Product not found')
      setProduct(data.product)
    } catch (error) {
      console.error('Error fetching product:', error)
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  const rupiahFormat = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(number)
  }

  const addToCart = () => {
    if (!isLoggedIn) {
      router.push('/auth/login')
      return
    }

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      stock: product.stock
    }

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id)

    let newCart
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      newCart = existingCart.map((item, index) => {
        if (index === existingItemIndex) {
          const newQuantity = item.quantity + quantity
          return {
            ...item,
            quantity: Math.min(newQuantity, item.stock) // Ensure we don't exceed stock
          }
        }
        return item
      })
    } else {
      // Add new item if it doesn't exist
      newCart = [...existingCart, cartItem]
    }

    localStorage.setItem('cart', JSON.stringify(newCart))
    alert('Product added to cart!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Product Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300">The product you're looking for doesn't exist.</p>
          <Link href="/">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white">
      <main className="container mx-auto py-8 px-4">
        <Link href="/" className="inline-flex items-center mb-6 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
            <div className="relative aspect-square">
              <Image 
                src={product.image ? `data:image/jpeg;base64,${product.image}` : '/assets/smartwatch.png'} 
                alt={product.name} 
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`} />
              ))}
              <span className="ml-2 text-gray-600 dark:text-gray-400">{product.rating || 0}</span>
            </div>
            <p className="text-2xl font-bold mb-4">{rupiahFormat(product.price)}</p>
            <p className="mb-6">{product.description}</p>
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Stock: {product.stock}</p>
            </div>
            <div className="flex items-center mb-6">
              <Button onClick={() => setQuantity(q => Math.max(1, q - 1))} variant="outline" className="px-3">-</Button>
              <span className="mx-4 text-xl">{quantity}</span>
              <Button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} variant="outline" className="px-3">+</Button>
            </div>
            <Button 
              className="w-full bg-gray-800 dark:bg-white text-white dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-100"
              disabled={product.stock === 0}
              onClick={addToCart}
            >
              <ShoppingCart className="mr-2" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
