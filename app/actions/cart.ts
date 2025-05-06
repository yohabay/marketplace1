"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function addToCart(productId: string) {
  const cartId = cookies().get("cartId")?.value;

  // If cartId exists, you could use it to log the action or perform other operations
  if (cartId) {
    console.log(`Adding product ${productId} to cart with ID: ${cartId}`);
  } else {
    console.warn("No cartId found, unable to add product to cart");
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Here you would typically add to your database
  // For demo, we'll just return success
  revalidatePath("/cart");

  return {
    success: true,
    message: "Added to cart",
  };
}

export async function removeFromCart(productId: string) {
  const cartId = cookies().get("cartId")?.value;

  // If cartId exists, you could use it to log the action or perform other operations
  if (cartId) {
    console.log(`Removing product ${productId} from cart with ID: ${cartId}`);
  } else {
    console.warn("No cartId found, unable to remove product from cart");
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Here you would typically remove from your database
  revalidatePath("/cart");

  return {
    success: true,
    message: "Removed from cart",
  };
}
