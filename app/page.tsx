import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Marketplace</h1>
      <p className="text-muted-foreground mb-8">Your destination for second-hand fashion and electronics</p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/auth">Sign In</Link>
        </Button>
      </div>
    </div>
  )
}

