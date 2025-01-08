'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductCard } from '@/components/product-card'

// Mock data - replace with actual API call
const mockWishlist = [
  {
    id: '1',
    title: 'Vintage Camera',
    price: 299,
    condition: 'Excellent',
    image: '/placeholder.svg',
    seller: {
      name: 'Camera Enthusiast',
      rating: 4.9,
      verified: true,
    },
    isWishlisted: true,
  },
  // Add more items...
]

export default function WishlistPage() {
  const [items, setItems] = useState(mockWishlist)

  const handleRemove = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Wishlist</h1>
      <AnimatePresence mode="popLayout">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground"
          >
            Your wishlist is empty
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <ProductCard
                key={item.id}
                {...item}
                onWishlistToggle={() => handleRemove(item.id)}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

