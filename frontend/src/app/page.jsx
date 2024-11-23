'use client'

import { useState, useEffect } from 'react';
import Carousel from '@/components/Carousel';
import ProductCard from '@/components/ProductCard';
import { Button } from "@/components/ui/button";

const Homepage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/products/products')
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products: ', error);
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Render Products Section
  const renderProducts = () => {
    if(loading) {
      return <div className="text-center">Loading products...</div>;
    }

    if (products.length === 0) {
      return <div className="text-center">No products found</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product._id}
            id={product._id}
            name={product.name}
            price={product.price}
            image={product.image || '/assets/smartwatch.png'}
            rating={product.rating || 0}
            stock={product.stock}
          />
        ))}
      </div>
    )
  }

  // Data state
  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'];
  
  const slides = [
    {
      image: '/assets/banner/banner1.png',
      title: 'Summer Sale',
      description: 'Up to 50% off on selected items',
      cta: 'Shop Now'
    },
    {
      image: '/assets/banner/banner2.png',
      title: 'New Arrivals',
      description: 'Check out our latest products',
      cta: 'Explore'
    },
    {
      image: '/assets/banner/banner3.png',
      title: 'Free Shipping',
      description: 'On orders over $100',
      cta: 'Learn More'
    }
  ]

  // Functions
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <main className="flex-grow bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white">
        <Carousel 
          slides={slides}
          currentSlide={currentSlide}
          nextSlide={nextSlide}
          prevSlide={prevSlide}
        />

        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Categories</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant="outline"
                className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>

          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
            <div className="container mx-auto px-4">
              {renderProducts()}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
