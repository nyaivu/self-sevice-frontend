"use client";

import React, { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiGetOrders } from "@/services/apiService";
import { PaginatedOrderResponse } from "@/interfaces/api";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";

// Helper component for the status badge
const StatusBadge = ({ status }: { status: "pending" | "paid" | "unpaid" }) => {
  let colorClasses = "bg-gray-200 text-gray-800"; // Default
  if (status === "paid") {
    colorClasses = "bg-green-200 text-green-800";
  } else if (status === "pending") {
    colorClasses = "bg-yellow-200 text-yellow-800";
  } else if (status === "unpaid") {
    colorClasses = "bg-red-200 text-red-800";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${colorClasses}`}
    >
      {status}
    </span>
  );
};

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-UK", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OrdersPage = () => {
  const [page, setPage] = useState(1);

  // 1. Fetch paginated orders
  const {
    data: paginatedOrders,
    isLoading,
    isError,
    error,
  } = useQuery<PaginatedOrderResponse, Error>({
    queryKey: ["orders", page], // Key includes the page number
    queryFn: () => apiGetOrders(page),
    placeholderData: keepPreviousData, // Keeps old data visible while new page loads
  });

  // --- Render States ---

  if (isLoading) {
    return <p className="p-8 text-center">Loading your orders...</p>;
  }

  if (isError) {
    return (
      <p className="p-8 text-center text-red-500">
        Error loading orders: {error.message}
      </p>
    );
  }

  if (!paginatedOrders || paginatedOrders.data.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">You have no past orders</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {/* List of Orders */}
      <div className="space-y-6">
        {paginatedOrders.data.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg shadow-md bg-white overflow-hidden"
          >
            {/* Order Header */}
            <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-semibold text-gray-800 break-all">
                  {order.id}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Date Placed</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>

            {/* Order Body */}
            <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Price</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(order.total_price, "IDR", "id-ID")}
                </p>
              </div>
              <div className="mt-2 sm:mt-0">
                <StatusBadge status={order.payment_status} />
              </div>
            </div>

            {/* Order Footer (Link to details) */}
            <div className="p-4 bg-gray-50 border-t">
              <Link
                href={`/orders/${order.id}`} // You'll create this page next
                className="text-blue-600 font-semibold hover:underline"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-row justify-between items-center mt-8">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={!paginatedOrders.links?.prev}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Previous
        </button>
        <span>
          Page {paginatedOrders.meta?.current_page} of{" "}
          {paginatedOrders.meta?.last_page}
        </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!paginatedOrders.links?.next}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersPage;
