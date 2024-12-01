'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'

export default function ProductDetail() {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    console.log('Product Detail - User Data:', userData)
    setIsLoggedIn(!!token)
    if (userData) {
      const parsedUser = JSON.parse(userData)
      console.log('Product Detail - Parsed User:', parsedUser)
      setUser(parsedUser)
    }
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

    if (!user) {
      console.log('No user data available')
      return
    }

    console.log('Adding to cart for user:', user)

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    }

    const cartKey = `cart_${user.id}`
    console.log('Cart Key:', cartKey)

    const existingCart = localStorage.getItem(cartKey)
    console.log('Existing Cart:', existingCart)
    
    let cart = []
    if (existingCart) {
      cart = JSON.parse(existingCart)
      const existingItemIndex = cart.findIndex(item => item.id === cartItem.id)
      
      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity
      } else {
        cart.push(cartItem)
      }
    } else {
      cart = [cartItem]
    }

    console.log('Updated Cart:', cart)
    localStorage.setItem(cartKey, JSON.stringify(cart))
    router.push('/cart')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative aspect-square">
              <Image
                src={product.image ? `data:image/jpeg;base64,${product.image}` : '/assets/smartwatch.png'}
                alt={product.name}
                fill
                className="object-contain rounded-lg"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                {product.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {product.description}
              </p>
              <div className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                {rupiahFormat(product.price)}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300">
                  Stock: {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                </p>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium text-gray-800 dark:text-white">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button
                className="w-full"
                onClick={addToCart}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
