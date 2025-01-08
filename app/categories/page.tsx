'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronRight, Laptop, ShirtIcon, Sofa, Watch } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Laptop,
    image: '/placeholder.svg',
    subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Audio'],
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: ShirtIcon,
    image: '/placeholder.svg',
    subcategories: ['Clothing', 'Shoes', 'Accessories', 'Bags', 'Jewelry'],
  },
  {
    id: 'home',
    name: 'Home & Living',
    icon: Sofa,
    image: '/placeholder.svg',
    subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bath', 'Outdoor'],
  },
  {
    id: 'watches',
    name: 'Watches',
    icon: Watch,
    image: '/placeholder.svg',
    subcategories: ['Luxury', 'Smart Watches', 'Classic', 'Sports', 'Fashion'],
  },
]

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Categories</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card 
              className="cursor-pointer overflow-hidden"
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={400}
                    height={200}
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center">
                      <category.icon className="mx-auto h-8 w-8" />
                      <h3 className="mt-2 text-lg font-semibold">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </div>
                {selectedCategory === category.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="divide-y"
                  >
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory}
                        href={`/products?category=${category.id}&subcategory=${subcategory.toLowerCase()}`}
                        className="flex items-center justify-between p-4 hover:bg-muted"
                      >
                        <span>{subcategory}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    ))}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

