"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <SessionProvider>
      {!isLoginPage && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
    </SessionProvider>
  );
}
