'use server'

import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = Number(formData.get('price'))
  const condition = formData.get('condition') as string
  const category = formData.get('category') as string
  
  // Validate data
  if (!title || !description || !price || !condition || !category) {
    return {
      error: 'All fields are required'
    }
  }

  // Here you would typically save to your database
  // For demo, we'll just return success
  revalidatePath('/products')
  
  return {
    success: true,
    message: 'Product created successfully'
  }
}

export async function searchProducts(query: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Mock search results
  return [
    {
      id: '1',
      title: 'Vintage Camera',
      price: 299,
      condition: 'Good',
      category: 'Electronics'
    },
    // Add more mock results
  ].filter(product => 
    product.title.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  )
}

