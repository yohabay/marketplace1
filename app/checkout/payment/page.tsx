'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function PaymentPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Clear cart after successful payment
      localStorage.setItem('cart', '[]')

      // Generate order number
      const orderNumber = Math.random().toString(36).substring(7).toUpperCase()

      toast({
        title: "Payment successful",
        description: `Your order #${orderNumber} has been confirmed.`,
      })

      // Redirect to order confirmation
      router.push(`/orders/${orderNumber}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: "Please check your card details and try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-2xl font-bold">Payment Details</h1>
          <p className="text-muted-foreground">
            Enter your card information to complete the purchase
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              required
              pattern="[0-9\s]{13,19}"
              maxLength={19}
              onChange={(e) => {
                // Format card number with spaces
                const value = e.target.value.replace(/\s/g, '')
                const formatted = value.match(/.{1,4}/g)?.join(' ') || value
                e.target.value = formatted
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                required
                pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
                maxLength={5}
                onChange={(e) => {
                  // Format expiry date
                  const value = e.target.value.replace('/', '')
                  if (value.length >= 2) {
                    e.target.value = `${value.slice(0, 2)}/${value.slice(2)}`
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                required
                pattern="[0-9]{3,4}"
                maxLength={4}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name on Card</Label>
            <Input
              id="name"
              placeholder="John Doe"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay $${(99.99).toFixed(2)}`
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Your payment information is encrypted and secure
        </div>
      </motion.div>
    </div>
  )
}

