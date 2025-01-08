'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function addToCart(productId: string) {
  const cartItems = JSON.parse(cookies().get('cart')?.value || '[]')
  cartItems.push(productId)
  cookies().set('cart', JSON.stringify(cartItems))
  revalidatePath('/cart')
  return { success: true }
}

export async function removeFromCart(productId: string) {
  const cartItems = JSON.parse(cookies().get('cart')?.value || '[]')
  const newItems = cartItems.filter((id: string) => id !== productId)
  cookies().set('cart', JSON.stringify(newItems))
  revalidatePath('/cart')
  return { success: true }
}

export async function toggleWishlist(productId: string) {
  const wishlistItems = JSON.parse(cookies().get('wishlist')?.value || '[]')
  const exists = wishlistItems.includes(productId)
  
  if (exists) {
    const newItems = wishlistItems.filter((id: string) => id !== productId)
    cookies().set('wishlist', JSON.stringify(newItems))
  } else {
    wishlistItems.push(productId)
    cookies().set('wishlist', JSON.stringify(wishlistItems))
  }
  
  revalidatePath('/wishlist')
  return { success: true }
}

export async function updateProfile(formData: FormData) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  revalidatePath('/profile')
  return { success: true }
}

