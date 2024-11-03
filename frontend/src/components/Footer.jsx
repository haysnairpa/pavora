import Link from 'next/link';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 py-12">
      <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">About Us</h3>
            <p className="text-sm">E-Shop is your one-stop destination for all your shopping needs. We offer a wide range of products at competitive prices.</p>
          </div>
          <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Customer Service</h3>
              <ul className="text-sm space-y-2">
                <li><Link href="/faq" className="hover:text-gray-800 dark:hover:text-white">FAQ</Link></li>
                <li><Link href="/shipping" className="hover:text-gray-800 dark:hover:text-white">Shipping</Link></li>
                <li><Link href="/returns" className="hover:text-gray-800 dark:hover:text-white">Returns</Link></li>
                <li><Link href="/contact" className="hover:text-gray-800 dark:hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">My Account</h3>
              <ul className="text-sm space-y-2">
                <li><Link href="/login" className="hover:text-gray-800 dark:hover:text-white">Login</Link></li>
                <li><Link href="/register" className="hover:text-gray-800 dark:hover:text-white">Register</Link></li>
                <li><Link href="/orders" className="hover:text-gray-800 dark:hover:text-white">Order History</Link></li>
                <li><Link href="/wishlist" className="hover:text-gray-800 dark:hover:text-white">Wishlist</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Follow Us</h3>
              <div className="flex space-x-4">
                <Link href="#" className="hover:text-gray-800 dark:hover:text-white"><Facebook /></Link>
                <Link href="#" className="hover:text-gray-800 dark:hover:text-white"><Twitter /></Link>
                <Link href="#" className="hover:text-gray-800 dark:hover:text-white"><Instagram /></Link>
                <Link href="#" className="hover:text-gray-800 dark:hover:text-white"><Github /></Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 