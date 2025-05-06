"use server";

import { login, logout } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function signIn(formData: FormData) {
  try {
    const result = await login(formData);
    revalidatePath("/");
    return result;
  } catch (error) {
    console.error("Sign-in error:", error); // Log the error for debugging
    return { error: "Invalid credentials" }; // Return an appropriate error message
  }
}

export async function signOut() {
  try {
    const result = await logout();
    revalidatePath("/");
    return result;
  } catch (error) {
    console.error("Sign-out error:", error); // Log the error for debugging
    return { error: "Failed to sign out" }; // Return an appropriate error message
  }
}

export async function signInWithGoogle() {
  // Implement Google OAuth flow
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true };
}

export async function signInWithFacebook() {
  // Implement Facebook OAuth flow
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true };
}
