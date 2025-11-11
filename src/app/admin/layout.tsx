"use client";

import { useSessionStore } from "@/stores/sessionStore";
import { redirect } from "next/navigation";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { role, _hasHydrated } = useSessionStore();

  if (!_hasHydrated) {
    return <p>Loading...</p>; // Or a proper spinner/skeleton
  }

  if (role !== "admin") {
    redirect("/");
  }

  return <div>{children}</div>;
};

export default AdminLayout;
