"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import ProductItem from "./ProductItem";
import { apiGetProducts } from "@/services/apiService"; // 1. Import from apiService
import { PaginatedProductResponse } from "@/interfaces/api"; // 2. Import the correct response type

const ProductsGrid = () => {
  // 3. Add state for pagination
  const [page, setPage] = useState(1);

  // 4. Update useQuery to handle the new function and response type
  const { data, isLoading, isError, error } = useQuery<
    PaginatedProductResponse,
    Error
  >({
    queryKey: ["products", page], // 5. Add page to queryKey
    queryFn: () => apiGetProducts(page), // 6. Call the new paginated function
    placeholderData: keepPreviousData, // (Recommended) Keeps old data while new data loads
  });

  if (isLoading) {
    return <p className="p-4 text-center">Loading products...</p>;
  }

  if (isError) {
    return (
      <p className="p-4 text-red-500">Failed to load data: {error.message}</p>
    );
  }

  return (
    <section className="flex flex-col gap-4 p-4">
      <div className="flex flex-row justify-between">
        <h2 className="font-bold text-3xl">Products</h2>
      </div>
      <div className="flex flex-col items-start md:grid grid-cols-4 grid-flow-row gap-4">
        {/* 7. Map over data.data (the array is nested) */}
        {data?.data?.map((product) => (
          // 8. Use product.id for the key
          <ProductItem key={product.id} product={product} />
        ))}
      </div>

      {/* 9. Add Pagination Controls */}
      <div className="flex flex-row justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={!data?.links?.prev}
          className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-400"
        >
          Previous
        </button>
        <span>
          Page {data?.meta?.current_page} of {data?.meta?.last_page}
        </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!data?.links?.next}
          className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default ProductsGrid;
