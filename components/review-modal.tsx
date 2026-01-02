'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Star } from 'lucide-react'
import { useState } from 'react'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productTitle: string
  sellerId: string
  onSubmitSuccess?: () => void
}

export function ReviewModal({
  isOpen,
  onClose,
  productId,
  productTitle,
  sellerId,
  onSubmitSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Here you would typically send the review data to your API
      const reviewData = {
        productId,
        sellerId,
        rating,
        review,
        createdAt: new Date().toISOString(),
      }

      console.log('Review submitted:', reviewData)

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      })

      onSubmitSuccess?.()
      setRating(5)
      setReview('')
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit review. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review {productTitle}</DialogTitle>
          <DialogDescription>
            Share your experience with this product
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-colors"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                >
                  <Star
                    className="h-8 w-8 transition-all"
                    fill={(hoveredRating !== null ? star <= hoveredRating : star <= rating)
                      ? 'currentColor'
                      : 'none'
                    }
                  />
                </button>
              ))}
            </div>
          </div>
          <Textarea
            placeholder="Write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="min-h-[100px]"
            required
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !review.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

