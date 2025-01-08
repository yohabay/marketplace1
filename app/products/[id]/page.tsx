'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageModal } from "@/components/message-modal"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

// Mock data - replace with actual API call
const mockProduct = {
  id: '1',
  title: 'Vintage Leica M6',
  description: 'Classic film camera in excellent condition. Comes with original leather case and strap.',
  price: 2999,
  condition: 'Excellent',
  category: 'Electronics',
  subcategory: 'Cameras',
  images: Array(5).fill('/placeholder.svg'),
  seller: {
    id: '1',
    name: 'Camera Enthusiast',
    rating: 4.9,
    verified: true,
    joinedDate: '2023',
    totalSales: 156,
  },
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const { toast } = useToast()

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    // Update localStorage
    const wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]')
    if (isWishlisted) {
      localStorage.setItem('wishlist', JSON.stringify(
        wishlistItems.filter((id: string) => id !== params.id)
      ))
    } else {
      localStorage.setItem('wishlist', JSON.stringify([...wishlistItems, params.id]))
    }
    
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted 
        ? "The item has been removed from your wishlist."
        : "The item has been added to your wishlist.",
    })
  }

  const handleAddToCart = () => {
    // Update localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
    localStorage.setItem('cart', JSON.stringify([...cartItems, params.id]))
    
    toast({
      title: "Added to cart",
      description: "The item has been added to your cart.",
    })
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: mockProduct.title,
        text: mockProduct.description,
        url: window.location.href,
      })
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={mockProduct.images[selectedImage]}
              alt={mockProduct.title}
              fill
              className="object-cover"
            />
          </motion.div>
          <div className="grid grid-cols-5 gap-2">
            {mockProduct.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <Image
                  src={image}
                  alt={`${mockProduct.title} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{mockProduct.title}</h1>
            <div className="mt-2 flex items-center gap-2">
              <Badge>{mockProduct.condition}</Badge>
              <Badge variant="secondary">{mockProduct.category}</Badge>
              <Badge variant="secondary">{mockProduct.subcategory}</Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">${mockProduct.price}</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleWishlist}
                className={isWishlisted ? 'text-red-500' : ''}
              >
                <Heart className="h-5 w-5" fill={isWishlisted ? 'currentColor' : 'none'} />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="text-muted-foreground">{mockProduct.description}</p>
          </div>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
              <CardDescription>
                Member since {mockProduct.seller.joinedDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold">
                    {mockProduct.seller.name}
                  </div>
                  {mockProduct.seller.verified && (
                    <Badge variant="secondary">Verified</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span>{mockProduct.seller.rating}</span>
                  <span className="text-muted-foreground">
                    ({mockProduct.seller.totalSales} sales)
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="w-full" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsMessageModalOpen(true)}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Seller
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        sellerId={mockProduct.seller.id}
        sellerName={mockProduct.seller.name}
      />
    </div>
  )
}

