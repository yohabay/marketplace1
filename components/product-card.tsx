'use client'

import { useState } from 'react'
import Image from "next/image"
import Link from "next/link"
import { motion } from 'framer-motion'
import { Heart, Loader2, Star } from 'lucide-react'
import { addToCart } from '@/app/actions/user'
import { toggleWishlist } from '@/app/actions/user'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface ProductCardProps {
  id: string
  title: string
  price: number
  condition: string
  image: string
  seller: {
    name: string
    rating: number
    verified: boolean
  }
  isWishlisted?: boolean
}

export function ProductCard({
  id,
  title,
  price,
  condition,
  image,
  seller,
  isWishlisted = false,
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isWishlistedState, setIsWishlistedState] = useState(isWishlisted)
  const { toast } = useToast()

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      await addToCart(id)
      toast({
        title: "Added to cart",
        description: "The item has been added to your cart.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent triggering card click
    try {
      await toggleWishlist(id)
      setIsWishlistedState(!isWishlistedState)
      toast({
        title: isWishlistedState ? "Removed from wishlist" : "Added to wishlist",
        description: isWishlistedState 
          ? "The item has been removed from your wishlist."
          : "The item has been added to your wishlist.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/products/${id}`}>
        <Card className="group overflow-hidden transition-all hover:shadow-lg">
          <CardContent className="p-0">
            <div className="relative">
              <Image
                src={image}
                alt={title}
                width={300}
                height={300}
                className="h-[200px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Button
                variant="ghost"
                size="icon"
                className={`absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm ${
                  isWishlistedState ? 'text-red-500' : ''
                }`}
                onClick={handleToggleWishlist}
              >
                <Heart className="h-4 w-4" fill={isWishlistedState ? 'currentColor' : 'none'} />
                <span className="sr-only">Add to wishlist</span>
              </Button>
            </div>
            <div className="space-y-2 p-4">
              <h3 className="font-semibold">{title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">${price}</span>
                <Badge variant="secondary">{condition}</Badge>
              </div>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <span>{seller.name}</span>
                <span>•</span>
                <div className="flex items-center">
                  <Star className="mr-1 h-3 w-3 fill-primary text-primary" />
                  <span>{seller.rating}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-2 p-4 pt-0">
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault() // Prevent triggering card click
                handleAddToCart()
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Add to Cart'
              )}
            </Button>
            <Button>View Details</Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}

