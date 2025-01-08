'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Loader2 } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data
const mockProducts = Array.from({ length: 12 }, (_, i) => ({
  id: `${i + 1}`,
  title: `Product ${i + 1}`,
  price: Math.floor(Math.random() * 1000) + 100,
  condition: ['New', 'Like New', 'Good', 'Fair'][Math.floor(Math.random() * 4)],
  category: ['Electronics', 'Fashion', 'Home', 'Other'][Math.floor(Math.random() * 4)],
  image: '/placeholder.svg',
  seller: {
    name: 'Seller Name',
    rating: 4.5,
    verified: true,
  },
}))

const conditions = ['New', 'Like New', 'Good', 'Fair']
const categories = ['Electronics', 'Fashion', 'Home', 'Other']
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
]

interface Filters {
  search: string
  priceRange: [number, number]
  condition: string[]
  category: string[]
  sort: string
}

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [products, setProducts] = useState(mockProducts)
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    priceRange: [
      Number(searchParams.get('minPrice')) || 0,
      Number(searchParams.get('maxPrice')) || 1000
    ],
    condition: searchParams.getAll('condition'),
    category: searchParams.getAll('category'),
    sort: searchParams.get('sort') || 'newest'
  })

  // Apply filters when they change
  useEffect(() => {
    setIsLoading(true)
    
    const applyFilters = () => {
      let filtered = [...mockProducts]

      // Search filter
      if (filters.search) {
        filtered = filtered.filter(product =>
          product.title.toLowerCase().includes(filters.search.toLowerCase())
        )
      }

      // Price range filter
      filtered = filtered.filter(product =>
        product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1]
      )

      // Condition filter
      if (filters.condition.length > 0) {
        filtered = filtered.filter(product =>
          filters.condition.includes(product.condition)
        )
      }

      // Category filter
      if (filters.category.length > 0) {
        filtered = filtered.filter(product =>
          filters.category.includes(product.category)
        )
      }

      // Sort
      switch (filters.sort) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          filtered.sort((a, b) => b.seller.rating - a.seller.rating)
          break
        default:
          // 'newest' - use default order
          break
      }

      setProducts(filtered)
      setIsLoading(false)
    }

    // Debounce filter application
    const timeoutId = setTimeout(applyFilters, 300)
    return () => clearTimeout(timeoutId)
  }, [filters])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    
    if (filters.search) params.set('q', filters.search)
    if (filters.condition.length > 0) {
      filters.condition.forEach(c => params.append('condition', c))
    }
    if (filters.category.length > 0) {
      filters.category.forEach(c => params.append('category', c))
    }
    params.set('minPrice', filters.priceRange[0].toString())
    params.set('maxPrice', filters.priceRange[1].toString())
    params.set('sort', filters.sort)

    router.push(`/products?${params.toString()}`, { scroll: false })
  }, [filters, router])

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const toggleFilter = (type: 'condition' | 'category', value: string) => {
    const current = filters[type]
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    updateFilters({ [type]: updated })
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      priceRange: [0, 1000],
      condition: [],
      category: [],
      sort: 'newest'
    })
    setIsFilterOpen(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="flex-1 md:max-w-sm">
            <Input
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
            />
          </div>
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {(filters.condition.length > 0 || filters.category.length > 0) && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.condition.length + filters.category.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your product search
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-4">
                  <Label>Price Range</Label>
                  <div className="px-2">
                    <Slider
                      min={0}
                      max={1000}
                      step={10}
                      value={filters.priceRange}
                      onValueChange={(value) => updateFilters({ priceRange: value })}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Condition</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {conditions.map((condition) => (
                      <Button
                        key={condition}
                        variant={filters.condition.includes(condition) ? 'default' : 'outline'}
                        className="justify-start"
                        onClick={() => toggleFilter('condition', condition)}
                      >
                        {condition}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Category</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={filters.category.includes(category) ? 'default' : 'outline'}
                        className="justify-start"
                        onClick={() => toggleFilter('category', category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <SheetFooter className="mt-6">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <Button onClick={() => setIsFilterOpen(false)}>
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        <Select
          value={filters.sort}
          onValueChange={(value) => updateFilters({ sort: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-12"
          >
            <Loader2 className="h-8 w-8 animate-spin" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {products.length === 0 && !isLoading && (
        <div className="text-center text-muted-foreground">
          No products found matching your criteria
        </div>
      )}
    </div>
  )
}

