"use client";

import { Twirl as Hamburger } from "hamburger-react";
import { useState } from "react";
import Link from "next/link";
import { useSessionStore } from "@/stores/sessionStore";
import { useMutation } from "@tanstack/react-query";
import { apiLogout } from "@/services/apiService";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // 1. Get all necessary state and functions from the store
  const isLoggedIn = useSessionStore((state) => state.isLoggedIn);
  const clearSession = useSessionStore((state) => state.clearSession);
  const _hasHydrated = useSessionStore((state) => state._hasHydrated);

  // 2. Create the logout mutation
  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      clearSession();
      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(`Logout failed: ${error.message}`);
      // Force clear session even if API fails
      clearSession();
      router.push("/login");
    },
    onSettled: () => {
      setIsOpen(false); // Close mobile menu if open
    },
  });

  // 3. Hydration check: Wait for the store to rehydrate before rendering
  if (!_hasHydrated) {
    return (
      <nav className="sticky bg-primary top-0 inset-x-0 flex flex-row justify-between items-center px-4 py-2 z-50 h-16">
        {/* Render a placeholder or null to prevent mismatch */}
      </nav>
    );
  }

  const handleMobileLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="sticky bg-primary text-white font-medium top-0 inset-x-0 flex flex-row justify-between items-center px-4 md: py-2 z-50">
      <div className="font-medium">
        <Link href="/">
          <p>Canteen</p>
        </Link>
      </div>

      {/* Desktop Menu */}
      <ul
        className={`hidden origin-top w-full sm:flex flex-row items-center justify-end z-40 gap-4 rounded-b-lg transition-all duration-300`}
      >
        <li>
          <Link
            className="w-full flex flex-row items-center gap-2"
            href="/orders"
          >
            <p>Orders</p>
          </Link>
        </li>
        <li>
          <Link href="/cart" className="flex flex-row gap-1">
            Cart
          </Link>
        </li>
        {/* 4. Conditional Login/Logout for Desktop */}
        {isLoggedIn ? (
          <li>
            <button
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="disabled:text-gray-500"
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </button>
          </li>
        ) : (
          <li>
            <Link href="/login">Login</Link>
          </li>
        )}
      </ul>

      {/* Mobile Menu Button */}
      <div className="sm:hidden bg-primary">
        <Hamburger
          rounded
          toggled={isOpen}
          toggle={setIsOpen}
          size={24}
          color="#ffffff"
        />
      </div>

      {/* Mobile Menu Dropdown */}
      <ul
        style={{
          transform: isOpen ? "scaleY(100%)" : "scaleY(0)",
        }}
        className={`bg-primary fixed inset-x-0 top-12 h-auto sm:hidden sm:h-0 origin-top w-full flex flex-col items-start justify-center z-40 text-lg gap-2 p-4 rounded-b-lg transition-all duration-300`}
      >
        <li className="w-full">
          <Link
            className="w-full flex flex-row items-center gap-2"
            href="/orders"
            onClick={handleMobileLinkClick}
          >
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
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
              />
            </svg>
            <p>Orders</p>
          </Link>
        </li>
        <li className="w-full">
          <Link
            className="w-full flex flex-row items-center gap-2"
            href="/cart"
            onClick={handleMobileLinkClick}
          >
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
            <p>Cart</p>
          </Link>
        </li>
        {/* 5. Conditional Login/Logout for Mobile */}
        {isLoggedIn ? (
          <li className="w-full">
            <button
              className="w-full flex flex-row items-center gap-2 disabled:text-gray-500"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
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
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
              <p>{logoutMutation.isPending ? "Logging out..." : "Logout"}</p>
            </button>
          </li>
        ) : (
          <li className="w-full">
            <Link
              className="w-full flex flex-row items-center gap-2"
              href="/login"
              onClick={handleMobileLinkClick}
            >
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
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>
              <p>Login</p>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
