"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiGetCart, apiCheckout } from "@/services/apiService";
import { CartItem } from "@/interfaces/api";
import { formatCurrency } from "@/utils/formatCurrency";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

type PaymentMethod = "qris" | "postpaid";

const CheckoutPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qris");

  // 1. Fetch the cart
  const {
    data: cartItems = [],
    isLoading,
    isError,
  } = useQuery<CartItem[], Error>({
    queryKey: ["cart"],
    queryFn: apiGetCart,
  });

  // 2. Handle empty cart: redirect if empty
  useEffect(() => {
    if (!isLoading && !isError && cartItems.length === 0) {
      toast.error("Your cart is empty. Redirecting...");
      router.push("/cart");
    }
  }, [isLoading, isError, cartItems, router]);

  // 3. Checkout Mutation
  const checkoutMutation = useMutation({
    mutationFn: apiCheckout,
    onSuccess: (order) => {
      toast.success("Order placed successfully!");
      // Invalidate cart so it's empty
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Invalidate orders list for any "My Orders" page
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // Redirect to a success page with the new order ID
      router.push(`/order-success/${order.id}`);
    },
    onError: (error) => {
      // The backend should handle "out of stock" errors
      toast.error(`Checkout failed: ${error.message}`);
    },
  });

  // 4. Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkoutMutation.mutate({ payment_method: paymentMethod });
  };

  // 5. Calculate Total
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const total = subtotal; // (Add taxes/fees here if needed)

  if (isLoading || cartItems.length === 0) {
    return <p className="p-8 text-center">Loading checkout...</p>;
  }

  if (isError) {
    return <p className="p-8 text-center text-red-500">Error loading cart.</p>;
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 my-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Left Column: Order Summary */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Order Summary</h2>
          <div className="divide-y divide-gray-200 border rounded-lg p-4 bg-white">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 py-3">
                <Image
                  src={
                    item.product.image_url ?? "https://via.placeholder.com/64"
                  }
                  alt={item.product.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain rounded-md border"
                />
                <div className="grow">
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">
                  {formatCurrency(
                    item.product.price * item.quantity,
                    "IDR",
                    "id-ID"
                  )}
                </p>
              </div>
            ))}
            <div className="pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  {formatCurrency(subtotal, "IDR", "id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span>{formatCurrency(total, "IDR", "id-ID")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Method */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Payment Method</h2>
          <div className="border rounded-lg p-6 bg-white space-y-4">
            {/* QRIS Option */}
            <label
              htmlFor="qris"
              className={`border p-4 rounded-md cursor-pointer flex flex-row ${
                paymentMethod === "qris"
                  ? "border-blue-600 ring-2 ring-blue-600"
                  : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                id="qris"
                value="qris"
                checked={paymentMethod === "qris"}
                onChange={() => setPaymentMethod("qris")}
                className="mr-2 mt-1"
              />
              <div>
                <span className="font-semibold">QRIS</span>
                <p className="text-sm text-gray-500">
                  Pay using any e-wallet or banking app that supports QRIS.
                </p>
              </div>
            </label>

            {/* Postpaid Option (No longer restricted) */}
            <label
              htmlFor="postpaid"
              className={`border p-4 rounded-md flex flex-row cursor-pointer ${
                paymentMethod === "postpaid"
                  ? "border-blue-600 ring-2 ring-blue-600"
                  : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                id="postpaid"
                value="postpaid"
                checked={paymentMethod === "postpaid"}
                onChange={() => setPaymentMethod("postpaid")}
                // No longer disabled
                className="mr-2 mt-1"
              />
              <div>
                <span className="font-semibold">Pascabayar (Postpaid)</span>
                <p className="text-sm text-gray-500">
                  {/* Updated text */}
                  Your order will be billed to your account.
                </p>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={checkoutMutation.isPending}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {checkoutMutation.isPending ? "Placing Order..." : "Place Order"}
          </button>
          <Link
            href="/cart"
            className="block text-center text-sm text-blue-600 hover:underline mt-2"
          >
            Return to Cart
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
