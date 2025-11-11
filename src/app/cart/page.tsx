"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiGetCart,
  apiUpdateCartItem,
  apiRemoveFromCart,
} from "@/services/apiService";
import { CartItem } from "@/interfaces/api";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/utils/formatCurrency";
import { toast } from "react-hot-toast";

// Simple spinner component
const SmallSpinner = () => (
  <svg
    className="animate-spin size-5 text-gray-500"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    ></path>
  </svg>
);

const CartPage = () => {
  const queryClient = useQueryClient();
  const [pendingItemId, setPendingItemId] = useState<number | null>(null);

  // 1. Fetch the cart
  const {
    data: cartItems = [], // Default to empty array
    isLoading,
    isError,
    error,
  } = useQuery<CartItem[], Error>({
    queryKey: ["cart"],
    queryFn: apiGetCart,
  });

  // 2. Mutation for updating quantity
  const updateMutation = useMutation({
    mutationFn: ({
      cartItemId,
      quantity,
    }: {
      cartItemId: number;
      quantity: number;
    }) => apiUpdateCartItem(cartItemId, { quantity }),
    onMutate: (variables) => {
      setPendingItemId(variables.cartItemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      toast.error(`Failed to update cart: ${error.message}`);
    },
    onSettled: () => {
      setPendingItemId(null);
    },
  });

  // 3. Mutation for removing an item
  const removeMutation = useMutation({
    mutationFn: (cartItemId: number) => apiRemoveFromCart(cartItemId),
    onMutate: (cartItemId) => {
      setPendingItemId(cartItemId);
    },
    onSuccess: () => {
      toast.success("Item removed from cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      toast.error(`Failed to remove item: ${error.message}`);
    },
    onSettled: () => {
      setPendingItemId(null);
    },
  });

  // 4. Handlers for quantity changes
  const handleDecrease = (item: CartItem) => {
    if (item.quantity > 1) {
      updateMutation.mutate({
        cartItemId: item.id,
        quantity: item.quantity - 1,
      });
    } else {
      // If quantity is 1, decreasing means removing
      removeMutation.mutate(item.id);
    }
  };

  const handleIncrease = (item: CartItem) => {
    updateMutation.mutate({
      cartItemId: item.id,
      quantity: item.quantity + 1,
    });
  };

  // 5. Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // --- Render States ---

  if (isLoading) {
    return <p className="p-8 text-center">Loading your cart...</p>;
  }

  if (isError) {
    return (
      <p className="p-8 text-center text-red-500">
        Error loading cart: {error.message}
      </p>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cart Items List */}
        <div className="grow divide-y divide-gray-200">
          {cartItems.map((item) => {
            const isItemPending = pendingItemId === item.id;
            return (
              <div key={item.id} className="flex gap-4 py-4">
                <Image
                  src={
                    item.product.image_url ?? "https://via.placeholder.com/100"
                  }
                  alt={item.product.name}
                  width={100}
                  height={100}
                  className="w-24 h-24 object-contain rounded-md border"
                />
                <div className="grow flex flex-col justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">
                      {item.product.name}
                    </h2>
                    <p className="text-gray-600">
                      {formatCurrency(item.product.price, "IDR", "id-ID")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Quantity Controls */}
                    {isItemPending ? (
                      <SmallSpinner />
                    ) : (
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => handleDecrease(item)}
                          disabled={isItemPending}
                          className="px-3 py-1 text-lg font-bold disabled:text-gray-300"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-x">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrease(item)}
                          disabled={isItemPending}
                          className="px-3 py-1 text-lg font-bold disabled:text-gray-300"
                        >
                          +
                        </button>
                      </div>
                    )}
                    {/* Remove Button */}
                    <button
                      onClick={() => removeMutation.mutate(item.id)}
                      disabled={isItemPending}
                      className="ml-4 text-red-500 hover:text-red-700 disabled:text-gray-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="md:w-80">
          <div className="border rounded-lg p-6 bg-gray-50 sticky top-24">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">
                {formatCurrency(subtotal, "IDR", "id-ID")}
              </span>
            </div>
            {/* You can add taxes and shipping here */}
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(subtotal, "IDR", "id-ID")}</span>
            </div>
            <Link
              href="/checkout"
              className="mt-6 w-full text-center bg-primary text-white py-3 rounded-md font-semibold block hover:bg-blue-700"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
