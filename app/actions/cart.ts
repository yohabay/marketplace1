'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function addToCart(productId: string) {
  const cartId = cookies().get('cartId')?.value

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Here you would typically add to your database
  // For demo, we'll just return success
  revalidatePath('/cart')
  
  return {
    success: true,
    message: 'Added to cart'
  }
}

export async function removeFromCart(productId: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Here you would typically remove from your database
  revalidatePath('/cart')
  
  return {
    success: true,
    message: 'Removed from cart'
  }
}

