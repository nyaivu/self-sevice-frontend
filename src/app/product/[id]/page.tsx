"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGetProduct, apiAddToCart } from "@/services/apiService";
import { Product } from "@/interfaces/api";
import { formatCurrency } from "@/utils/formatCurrency";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { useSessionStore } from "@/stores/sessionStore";

const ProductDetailPage = () => {
  const isLoggedIn = useSessionStore((state) => state.isLoggedIn);

  const params = useParams();
  const id = params.id as string; // Get the [id] from the URL

  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  // 1. Fetch the specific product using its ID
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery<Product, Error>({
    queryKey: ["product", id], // Unique query key for this product
    queryFn: () => apiGetProduct(Number(id)),
    enabled: !!id, // Only run the query if the id is available
  });

  // 2. Set up the mutation for adding to cart
  const addToCartMutation = useMutation({
    mutationFn: apiAddToCart,
    onSuccess: () => {
      toast.success(`${quantity} x ${product?.name} added to cart!`);
      // Refetch the cart data in the navbar or other components
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      toast.error(`Failed to add item: ${error.message}`);
    },
  });

  // --- Handlers ---
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1)); // Don't go below 1
  };

  const handleAddToCart = () => {
    if (!product) return;
    // Pass the selected product ID and quantity
    addToCartMutation.mutate({
      product_id: product.id,
      quantity: quantity,
    });
  };

  // --- Render States ---
  if (isLoading) {
    return <p className="p-8 text-center">Loading product...</p>;
  }

  if (isError) {
    return (
      <p className="p-8 text-center text-red-500">
        Error loading product: {error.message}
      </p>
    );
  }

  if (!product) {
    return <p className="p-8 text-center">Product not found.</p>;
  }

  const imageUrl = product.image_url ?? "https://via.placeholder.com/500";

  return (
    <div className="container mx-auto max-w-4xl p-4 my-8">
      <div className="mb-4">
        <Link href="/" className="text-primary hover:underline">
          &larr; Back to products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Image */}
        <div className="w-full">
          <Image
            src={imageUrl}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-auto object-contain rounded-lg border bg-white"
          />
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col gap-4">
          {product.category && (
            <Link
              href={`/categories/${product.category.id}`} // Assuming you have a category page
              className="text-primary font-semibold"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-3xl font-light text-gray-900">
            {formatCurrency(product.price, "IDR", "id-ID")}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {product.description ?? "No description available."}
          </p>

          {isLoggedIn && (
            <div className="border-t pt-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-4">
                <label htmlFor="quantity" className="font-semibold">
                  Quantity:
                </label>
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={handleDecrease}
                    className="px-4 py-2 text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="px-5 py-2 border-x">{quantity}</span>
                  <button
                    onClick={handleIncrease}
                    className="px-4 py-2 text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
                className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {addToCartMutation.isPending
                  ? "Adding to cart..."
                  : "Add to Cart"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
