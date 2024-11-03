'use client'

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import Carousel from '@/components/Carousel';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";

const Homepage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Data state
  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'];
  const products = [
    { id: 1, name: 'Wireless Headphones', price: 99.99, rating: 4.5, image: '/assets/smartwatch.png' },
    { id: 2, name: 'Smart Watch', price: 199.99, rating: 4.2, image: '/assets/smartwatch.png' },
    { id: 3, name: 'Laptop', price: 999.99, rating: 4.8, image: '/assets/smartwatch.png' },
    { id: 4, name: 'Smartphone', price: 699.99, rating: 4.6, image: '/assets/smartwatch.png' },
  ]
  
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

        <div className="container mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6">Categories</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant="outline"
                className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="container mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
