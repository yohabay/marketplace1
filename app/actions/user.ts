"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function addToCart(productId: string) {
  // Retrieve the cart items from the cookies, or initialize it as an empty array
  const cartItems = JSON.parse(cookies().get("cart")?.value || "[]");

  // Add the new product to the cart
  cartItems.push(productId);

  // Save the updated cart back to cookies
  cookies().set("cart", JSON.stringify(cartItems));

  // Revalidate the path for the cart
  revalidatePath("/cart");

  return { success: true };
}

export async function removeFromCart(productId: string) {
  // Retrieve the cart items from the cookies, or initialize it as an empty array
  const cartItems = JSON.parse(cookies().get("cart")?.value || "[]");

  // Remove the product from the cart
  const newItems = cartItems.filter((id: string) => id !== productId);

  // Save the updated cart back to cookies
  cookies().set("cart", JSON.stringify(newItems));

  // Revalidate the path for the cart
  revalidatePath("/cart");

  return { success: true };
}

export async function toggleWishlist(productId: string) {
  // Retrieve the wishlist items from the cookies, or initialize it as an empty array
  const wishlistItems = JSON.parse(cookies().get("wishlist")?.value || "[]");

  // Check if the product is already in the wishlist
  const exists = wishlistItems.includes(productId);

  if (exists) {
    // Remove product from the wishlist if it exists
    const newItems = wishlistItems.filter((id: string) => id !== productId);
    cookies().set("wishlist", JSON.stringify(newItems));
  } else {
    // Add product to the wishlist if it doesn't exist
    wishlistItems.push(productId);
    cookies().set("wishlist", JSON.stringify(wishlistItems));
  }

  // Revalidate the path for the wishlist
  revalidatePath("/wishlist");

  return { success: true };
}

export async function updateProfile(formData: FormData) {
  // Example of how to use formData: extracting user profile details
  const name = formData.get("name");
  const email = formData.get("email");

  // You could do something with the formData, like update a user profile in a database
  console.log(`Updating profile for ${name} with email ${email}`);

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Revalidate the path for the profile page
  revalidatePath("/profile");

  return { success: true };
}
