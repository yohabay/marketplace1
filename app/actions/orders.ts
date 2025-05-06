"use server";

import { revalidatePath } from "next/cache";
import Stripe from "stripe";

// Make sure you are using the correct API version for your Stripe setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia", // Replace with correct version if needed
});

export async function createPaymentIntent(amount: number) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: "usd",
  });

  // Log payment intent details for debugging purposes
  console.log("Payment Intent Created:", paymentIntent.id);

  return { clientSecret: paymentIntent.client_secret };
}

export async function createOrder(formData: FormData) {
  // If you need to use formData, process it as needed. For example, extracting some data:
  const orderDetails = formData.get("orderDetails"); // Example of using formData

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const orderNumber = Math.random().toString(36).substring(7);

  // Log the generated order number for future reference
  console.log("Order created with Order Number:", orderNumber);

  revalidatePath("/orders");
  return { success: true, orderNumber, orderDetails }; // Returning orderDetails if needed
}

export async function getOrderStatus(orderNumber: string) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Log the order number and its status for debugging purposes
  console.log(`Checking status for order: ${orderNumber}`);

  return {
    status: "processing",
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    tracking: {
      carrier: "UPS",
      number: "1Z999AA1234567890",
    },
  };
}
