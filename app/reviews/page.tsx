'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Search, Filter, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    productId: 'p1',
    productTitle: 'Vintage Camera',
    productImage: '/placeholder.svg',
    rating: 5,
    review: 'Excellent condition, exactly as described. The seller was very helpful and shipping was fast.',
    reviewer: {
      name: 'John Doe',
      avatar: '/placeholder.svg',
      date: '2024-01-05',
    },
    seller: {
      name: 'Camera Enthusiast',
      response: 'Thank you for your kind review! I\'m glad you\'re happy with your purchase.',
      responseDate: '2024-01-06',
    }
  },
  {
    id: '2',
    productId: 'p2',
    productTitle: 'Mechanical Keyboard',
    productImage: '/placeholder.svg',
    rating: 4,
    review: 'Great keyboard, minor wear but works perfectly. Good communication from seller.',
    reviewer: {
      name: 'Jane Smith',
      avatar: '/placeholder.svg',
      date: '2024-01-04',
    }
  },
  // Add more mock reviews...
]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRating, setFilterRating] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')

  const filteredReviews = reviews
    .filter(review => {
      const matchesSearch = review.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          review.review.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating)
      return matchesSearch && matchesRating
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.reviewer.date).getTime() - new Date(b.reviewer.date).getTime()
        case 'highest':
          return b.rating - a.rating
        case 'lowest':
          return a.rating - b.rating
        default: // 'newest'
          return new Date(b.reviewer.date).getTime() - new Date(a.reviewer.date).getTime()
      }
    })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="text-muted-foreground">
          Browse and manage your product reviews
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-between">
              <span>Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy('newest')}>
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('oldest')}>
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('highest')}>
              Highest Rating
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('lowest')}>
              Lowest Rating
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredReviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-muted-foreground"
          >
            No reviews found
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Image
                          src={review.productImage}
                          alt={review.productTitle}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                        <div>
                          <CardTitle>{review.productTitle}</CardTitle>
                          <CardDescription>
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-primary text-primary'
                                      : 'fill-muted text-muted'
                                  }`}
                                />
                              ))}
                            </div>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {new Date(review.reviewer.date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <Image
                          src={review.reviewer.avatar}
                          alt={review.reviewer.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{review.reviewer.name}</p>
                          <p className="text-muted-foreground">{review.review}</p>
                        </div>
                      </div>
                      {review.seller?.response && (
                        <div className="ml-14 rounded-lg bg-muted p-4">
                          <p className="font-medium">{review.seller.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {review.seller.response}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Responded on {new Date(review.seller.responseDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

