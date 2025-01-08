import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { Header } from "@/components/header"
import "./globals.css"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Used Products Marketplace',
  description: 'Buy and sell second-hand fashion and electronics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <Header />
        <main>
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}

