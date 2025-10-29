"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiGetOrder } from "@/services/apiService";
import { Order } from "@/interfaces/api";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";

// Helper component for the status badge (copied from orders page)
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

const OrderSuccessPage = () => {
  const params = useParams();
  const orderId = params.id as string;

  // 1. Fetch the order that was just created
  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery<Order, Error>({
    queryKey: ["order", orderId], // Unique query key for this order
    queryFn: () => apiGetOrder(orderId),
    enabled: !!orderId, // Only run if orderId exists
  });

  // --- Render States ---
  if (isLoading) {
    return <p className="p-8 text-center">Confirming your order...</p>;
  }

  if (isError) {
    return (
      <p className="p-8 text-center text-red-500">
        Error loading order details: {error.message}
      </p>
    );
  }

  if (!order) {
    return <p className="p-8 text-center">Order not found.</p>;
  }

  // --- Success State ---
  return (
    <div className="container mx-auto max-w-2xl p-8 my-10">
      <div className="bg-white shadow-xl rounded-lg p-8 border border-gray-200">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <svg
            className="size-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Thank You!</h1>
          <p className="text-lg text-gray-600 mt-2">
            Your order has been placed successfully.
          </p>
        </div>

        {/* Conditional Message */}
        {order.payment_method === "qris" &&
          order.payment_status === "pending" && (
            <div
              className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md my-6"
              role="alert"
            >
              <p className="font-bold">Pending Payment</p>
              <p>
                Your order is pending. Please complete your QRIS payment. (In a
                real app, this is where you would show the QR code).
              </p>
            </div>
          )}

        {order.payment_status === "unpaid" && (
          <div
            className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md my-6"
            role="alert"
          >
            <p className="font-bold">Order Confirmed</p>
            <p>
              Your order has been placed and will be billed to your account.
            </p>
          </div>
        )}

        {/* Order Details Summary */}
        <div className="border-t border-b my-6 py-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-semibold text-gray-800 break-all text-right">
              {order.id}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-semibold text-gray-800 capitalize">
              {order.payment_method}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Status:</span>
            <StatusBadge status={order.payment_status} />
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-bold text-xl text-gray-900">
              {formatCurrency(order.total_price, "IDR", "id-ID")}
            </span>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/orders"
            className="w-full text-center px-4 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
          >
            View My Orders
          </Link>
          <Link
            href="/"
            className="w-full text-center px-4 py-3 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
