'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Menu, Package, Search, ShoppingCart, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NotificationsPanel } from "@/components/notifications-panel"

export function Header() {
  const pathname = usePathname()
  const isAuth = pathname.startsWith('/auth')
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  useEffect(() => {
    const updateCounts = () => {
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
      const wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]')
      setCartCount(cartItems.length)
      setWishlistCount(wishlistItems.length)
    }

    // Initial count
    updateCounts()

    // Listen for storage changes
    window.addEventListener('storage', updateCounts)
    return () => window.removeEventListener('storage', updateCounts)
  }, [])

  if (isAuth) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileNav />
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Package className="h-6 w-6" />
          <span className="font-bold inline-block">Marketplace</span>
        </Link>
        <div className="flex items-center space-x-4 lg:space-x-6">
          <Button variant="ghost" className="hidden md:flex" asChild>
            <Link href="/products">Products</Link>
          </Button>
          <Button variant="ghost" className="hidden md:flex" asChild>
            <Link href="/categories">Categories</Link>
          </Button>
          <Button variant="ghost" className="hidden md:flex" asChild>
            <Link href="/sell">Sell</Link>
          </Button>
        </div>
        <div className="flex flex-1 items-center space-x-4 md:justify-end md:space-x-6">
          <form className="flex-1 md:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 md:w-[300px] lg:w-[400px]"
              />
            </div>
          </form>
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hidden md:flex relative" asChild>
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {wishlistCount}
                  </Badge>
                )}
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>
            <NotificationsPanel />
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {cartCount}
                  </Badge>
                )}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  )
}

function MobileNav() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Link href="/products" className="text-sm font-medium">
        Products
      </Link>
      <Link href="/categories" className="text-sm font-medium">
        Categories
      </Link>
      <Link href="/sell" className="text-sm font-medium">
        Sell
      </Link>
      <Link href="/wishlist" className="text-sm font-medium">
        Wishlist
      </Link>
      <Link href="/notifications" className="text-sm font-medium">
        Notifications
      </Link>
    </div>
  )
}

