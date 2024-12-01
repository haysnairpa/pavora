'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    console.log('Cart - User Data:', userData)
    
    if (!userData) {
      router.push('/auth/login')
      return
    }

    // Get user-specific cart
    const parsedUser = JSON.parse(userData)
    console.log('Cart - Parsed User:', parsedUser)
    setUser(parsedUser)

    const cartKey = `cart_${parsedUser.id}` 
    console.log('Cart - Cart Key:', cartKey)
    
    const savedCart = localStorage.getItem(cartKey)
    console.log('Cart - Saved Cart:', savedCart)
    
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      console.log('Cart - Parsed Cart:', parsedCart)
      setCartItems(parsedCart)
    }
  }, [])

  const updateQuantity = (id, newQuantity) => {
    if (!user) return

    const cartKey = `cart_${user.id}`
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
    ).filter(item => item.quantity > 0)
    setCartItems(updatedCart)
    localStorage.setItem(cartKey, JSON.stringify(updatedCart))
  }

  const removeItem = (id) => {
    if (!user) return

    const cartKey = `cart_${user.id}`
    const updatedCart = cartItems.filter(item => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem(cartKey, JSON.stringify(updatedCart))
  }

  const clearCart = () => {
    if (!user) return

    const cartKey = `cart_${user.id}`
    setCartItems([])
    localStorage.setItem(cartKey, JSON.stringify([]))
  }

  const rupiahFormat = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(number)
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white">
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          {cartItems.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clearCart}
              className="text-red-500 hover:text-red-600"
            >
              Clear Cart
            </Button>
          )}
        </div>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="mb-4">Your cart is empty.</p>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center space-x-4 bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                  <div className="relative w-20 h-20">
                    <Image 
                      src={item.image ? `data:image/jpeg;base64,${item.image}` : '/assets/smartwatch.png'}
                      alt={item.name}
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{rupiahFormat(item.price)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-xl">{rupiahFormat(total)}</span>
              </div>
              <Button className="w-full bg-gray-800 dark:bg-white text-white dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-100">
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}