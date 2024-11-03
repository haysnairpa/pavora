'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import SearchBar from '@/components/SearchBar'
import Footer from '@/components/Footer'
import "./globals.css"

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <html lang="en">
      <body className={`font-geist ${darkMode ? 'dark' : ''}`}>
        {!isAuthPage ? (
          <>
            <Navbar />
            <SearchBar toggleDarkMode={toggleDarkMode} />
            {children}
            <Footer />
          </>
        ) : (
          <div className="dark:bg-gray-900">
            {children}
          </div>
        )}
      </body>
    </html>
  )
}
