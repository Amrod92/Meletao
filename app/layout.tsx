import "./globals.css";
import { AppNav } from "@/components/app-nav";
import { isLoggedIn } from "@/lib/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedIn = await isLoggedIn();

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <AppNav isLoggedIn={loggedIn} />

        <main className={loggedIn ? "pb-24" : "pt-3"}>{children}</main>
      </body>
    </html>
  );
}
