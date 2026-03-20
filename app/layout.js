import "./globals.css";
import QueryProvider from "../components/providers/query-provider";

export const metadata = {
  title: "Next.js Todo App",
  description: "Todo app with Zustand, Zod and TanStack Query",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}