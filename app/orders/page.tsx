'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Package, Truck, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Mock orders data
const mockOrders = [
  {
    id: 'ORD123',
    date: '2024-01-05',
    status: 'delivered',
    total: 299.99,
    items: [
      {
        id: '1',
        title: 'Vintage Camera',
        price: 299.99,
        image: '/placeholder.svg',
        quantity: 1,
      }
    ],
    tracking: {
      carrier: 'UPS',
      number: '1Z999AA1234567890',
    }
  },
  {
    id: 'ORD456',
    date: '2024-01-07',
    status: 'processing',
    total: 599.98,
    items: [
      {
        id: '2',
        title: 'Mechanical Keyboard',
        price: 299.99,
        image: '/placeholder.svg',
        quantity: 2,
      }
    ],
  }
]

const statusIcons = {
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
}

export default function OrdersPage() {
  const [orders] = useState(mockOrders)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No orders found
          </div>
        ) : (
          orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Order #{order.id}</CardTitle>
                  <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Ordered on {new Date(order.date).toLocaleDateString()}</span>
                    <span>Total: ${order.total.toFixed(2)}</span>
                  </div>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.tracking && (
                    <div className="rounded-lg bg-muted p-4">
                      <h4 className="mb-2 font-semibold">Tracking Information</h4>
                      <p className="text-sm">
                        {order.tracking.carrier}: {order.tracking.number}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" asChild>
                      <Link href={`/orders/${order.id}`}>View Details</Link>
                    </Button>
                    {order.status === 'delivered' && (
                      <Button>Leave Review</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

