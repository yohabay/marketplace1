'use server'

import { revalidatePath } from 'next/cache'
import { login, logout } from '@/lib/auth'

export async function signIn(formData: FormData) {
  try {
    const result = await login(formData)
    revalidatePath('/')
    return result
  } catch (error) {
    return { error: 'Invalid credentials' }
  }
}

export async function signOut() {
  try {
    const result = await logout()
    revalidatePath('/')
    return result
  } catch (error) {
    return { error: 'Failed to sign out' }
  }
}

export async function signInWithGoogle() {
  // Implement Google OAuth flow
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { success: true }
}

export async function signInWithFacebook() {
  // Implement Facebook OAuth flow
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { success: true }
}

