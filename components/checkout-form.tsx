'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { createOrder } from '@/app/actions/orders'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function CheckoutForm() {
  const [isLoading, setIsLoading] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsLoading(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/confirmation`,
        },
      })

      if (error) {
        toast({
          variant: "destructive",
          title: "Payment failed",
          description: error.message,
        })
        return
      }

      // Create order
      const formData = new FormData()
      formData.append('paymentIntent', 'pi_123') // Add actual payment intent ID
      const { orderNumber } = await createOrder(formData)

      toast({
        title: "Order placed successfully!",
        description: `Your order number is ${orderNumber}`,
      })

      router.push(`/orders/${orderNumber}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={isLoading || !stripe}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Pay now'
        )}
      </Button>
    </form>
  )
}

export function CheckoutFormWrapper({ clientSecret }: { clientSecret: string }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  )
}

