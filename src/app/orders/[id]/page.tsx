"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiGetOrder } from "@/services/apiService";
import { Order } from "@/interfaces/api";
import Link from "next/link";
import Image from "next/image";
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
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OrderDetailPage = () => {
  const params = useParams();
  const orderId = params.id as string;

  // 1. Fetch the specific order by its ID
  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery<Order, Error>({
    queryKey: ["order", orderId], // Unique query key
    queryFn: () => apiGetOrder(orderId),
    enabled: !!orderId, // Only run if orderId exists
  });

  // --- Render States ---
  if (isLoading) {
    return <p className="p-8 text-center">Loading order details...</p>;
  }

  if (isError) {
    return (
      <p className="p-8 text-center text-red-500">
        Error loading order: {error.message}
      </p>
    );
  }

  if (!order) {
    return <p className="p-8 text-center">Order not found.</p>;
  }

  // --- Success State ---
  return (
    <div className="container mx-auto max-w-4xl p-4 my-8">
      <div className="mb-4">
        <Link href="/orders" className="text-primary hover:underline">
          &larr; Back to My Orders
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-lg border">
        {/* Header Section */}
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-gray-600 mt-2">
            Order placed on {formatDate(order.created_at)}
          </p>
          <p className="text-sm text-gray-500 break-all">
            Order ID: {order.id}
          </p>
        </div>

        {/* Summary Section */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-b">
          <div>
            <p className="text-sm text-gray-600">Total Price</p>
            <p className="text-xl font-bold">
              {formatCurrency(order.total_price, "IDR", "id-ID")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="text-lg font-semibold capitalize">
              {order.payment_method}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Status</p>
            <StatusBadge status={order.payment_status} />
          </div>
          <div>
            <p className="text-sm text-gray-600">User</p>
            <p className="text-lg font-semibold">{order.user?.name}</p>
          </div>
        </div>

        {/* Products List Section */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Items in this Order</h2>
          <div className="space-y-4 divide-y divide-gray-200">
            {order.products?.map((product) => (
              <div key={product.id} className="flex gap-4 pt-4">
                <Image
                  src={product.image_url ?? "https://via.placeholder.com/100"}
                  alt={product.name}
                  width={100}
                  height={100}
                  className="w-24 h-24 object-contain rounded-md border"
                />
                <div className="grow">
                  <Link
                    href={`/product/${product.id}`}
                    className="font-semibold text-lg text-primary hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="text-gray-600">
                    Price at purchase:{" "}
                    {formatCurrency(product.pivot!.price, "IDR", "id-ID")}
                  </p>
                  <p className="text-gray-600">
                    Quantity: {product.pivot!.quantity}
                  </p>
                </div>
                <p className="font-semibold text-lg">
                  {formatCurrency(
                    product.pivot!.price * product.pivot!.quantity,
                    "IDR",
                    "id-ID"
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
