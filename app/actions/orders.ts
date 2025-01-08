'use server'

import { revalidatePath } from 'next/cache'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export async function createPaymentIntent(amount: number) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: 'usd',
  })
  
  return { clientSecret: paymentIntent.client_secret }
}

export async function createOrder(formData: FormData) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const orderNumber = Math.random().toString(36).substring(7)
  
  revalidatePath('/orders')
  return { success: true, orderNumber }
}

export async function getOrderStatus(orderNumber: string) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    status: 'processing',
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    tracking: {
      carrier: 'UPS',
      number: '1Z999AA1234567890',
    },
  }
}

