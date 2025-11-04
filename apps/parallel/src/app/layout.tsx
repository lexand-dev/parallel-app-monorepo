import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import GQLProvider from "@/lib/gql-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Parallel GQL",
  keywords: ["nextjs", "graphql", "urql", "react"],
  description: "A Next.js app with GraphQL and urql"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased min-h-screen", inter.className)}>
        <GQLProvider>
          <Toaster />
          <NuqsAdapter>{children}</NuqsAdapter>
        </GQLProvider>
      </body>
    </html>
  );
}
