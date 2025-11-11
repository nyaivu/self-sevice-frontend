import Image from "next/image";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";
import { Product } from "@/interfaces/api"; // 1. Use interface from central file
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // 2. Import mutation hooks
import { apiAddToCart } from "@/services/apiService"; // 3. Import the API function
import { toast } from "react-hot-toast"; // 4. Import toast for user feedback

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  // 5. Get query client to refetch cart data on success
  const queryClient = useQueryClient();

  // Fallback image in case product.image_url is null
  const imageUrl = product.image_url ?? "https://via.placeholder.com/200";

  // 6. Set up the mutation for adding to cart
  const addToCartMutation = useMutation({
    mutationFn: () => apiAddToCart({ product_id: product.id, quantity: 1 }),
    onSuccess: () => {
      // On success, show a toast
      toast.success(`${product.name} added to cart!`);
      // And invalidate the "cart" query to update cart indicators/pages
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      // On error, show a toast
      toast.error(`Failed to add item: ${error.message}`);
    },
  });

  return (
    <div className="group h-full w-full flex flex-col items-start justify-center border border-gray-300 rounded-lg px-4 py-2 shadow hover:shadow-lg transition-all">
      <Link
        className="w-full flex flex-col items-start content-center gap-2"
        href={`/product/${product.id}`}
      >
        <Image
          src={imageUrl}
          alt={product.name}
          className="w-full max-h-48 object-contain justify-self-center rounded-md"
          width={200}
          height={200}
        />
        <h2 className="font-semibold">{product.name}</h2>
        <p className="text-gray-600">
          {product.category?.name ?? "Uncategorized"}
        </p>
      </Link>
      <div className="w-full flex flex-row items-center justify-between">
        <p className="text-gray-600 font-bold p-1">
          {formatCurrency(product.price, "IDR", "id-ID")}
        </p>
        <button
          // 7. Call the mutation's 'mutate' function on click
          onClick={() => addToCartMutation.mutate()}
          // 8. Disable button while the API call is in progress
          disabled={addToCartMutation.isPending}
          className="opacity-0 group-hover:opacity-100 transition-all aspect-square cursor-pointer bg-primary rounded-full text-white px-2 py-1 hover:underline mt-2 block disabled:bg-gray-400 disabled:opacity-100"
        >
          {/* 9. Show a loader while pending, otherwise the icon */}
          {addToCartMutation.isPending ? (
            <svg
              className="animate-spin size-6"
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
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
