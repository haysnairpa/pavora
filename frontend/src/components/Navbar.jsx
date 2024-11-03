'use client'

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-sm relative">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">E-Shop</Link>
          
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>

          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li><Link href="/" className="hover:text-gray-600 dark:hover:text-gray-300">Home</Link></li>
              <li><Link href="/products" className="hover:text-gray-600 dark:hover:text-gray-300">Products</Link></li>
              <li><Link href="/about" className="hover:text-gray-600 dark:hover:text-gray-300">About</Link></li>
              <li><Link href="/contact" className="hover:text-gray-600 dark:hover:text-gray-300">Contact</Link></li>
            </ul>
          </nav>

          {isMenuOpen && (
            <nav className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg md:hidden z-50">
              <ul className="flex flex-col p-4">
                <li className="py-2"><Link href="/" className="block hover:text-gray-600 dark:hover:text-gray-300">Home</Link></li>
                <li className="py-2"><Link href="/products" className="block hover:text-gray-600 dark:hover:text-gray-300">Products</Link></li>
                <li className="py-2"><Link href="/about" className="block hover:text-gray-600 dark:hover:text-gray-300">About</Link></li>
                <li className="py-2"><Link href="/contact" className="block hover:text-gray-600 dark:hover:text-gray-300">Contact</Link></li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar; 