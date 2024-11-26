'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import "./globals.css"

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')
  const isProfilePage = pathname?.startsWith('/user/profile')
  const isDashboardPage = pathname?.startsWith('/admin/dashboard')
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  return (
    <html lang="en">
      <body className={`font-geist ${darkMode ? 'dark' : ''}`}>
        {!isAuthPage ? (
          <>
            <Navbar toggleDarkMode={toggleDarkMode} onSearch={handleSearch} />
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
