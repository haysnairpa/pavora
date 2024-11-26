'use client'

import { useState, useEffect } from 'react';
import Carousel from '@/components/Carousel';
import ProductCard from '@/components/ProductCard';
import { Button } from "@/components/ui/button";
import { useSearchParams } from 'next/navigation';

const Homepage = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchProducts()
    fetchCategories()
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

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/categories/categories')
      if (!res.ok) throw new Error('Failed to fetch categories')
      const data = await res.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching categories: ', error);
      setCategories([])
    }
  }

  // Fungsi filter products
  const filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchSearch && matchCategory;
  });

  // Handle search dari navbar
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle filter kategori
  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  // Render Products Section
  const renderProducts = () => {
    if(loading) {
      return <div className="text-center">Loading products...</div>;
    }

    if (filteredProducts.length === 0) {
      return (
        <div className="text-center">
          <p>No products found</p>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2">
              Try searching with different keywords
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product._id}
            id={product._id}
            name={product.name}
            price={product.price}
            image={product.image}
            rating={product.rating || 0}
            stock={product.stock}
          />
        ))}
      </div>
    );
  };
  
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
    <div className="min-h-screen flex flex-col">
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
                variant={selectedCategory === category ? "default" : "outline"}
                className={`whitespace-nowrap ${
                  selectedCategory === category 
                    ? "bg-gray-800 text-white dark:bg-white dark:text-gray-800" 
                    : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                }`}
                onClick={() => handleCategoryClick(category)}
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
