'use client'

import { getOrderStatus } from '@/app/actions/orders'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'

interface OrderStatus {
  status: 'processing' | 'shipped' | 'delivered'
  estimatedDelivery: Date
  tracking: {
    carrier: string
    number: string
  }
}

export function OrderTracking({ orderNumber }: { orderNumber: string }) {
  const [status, setStatus] = useState<OrderStatus | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      const result = await getOrderStatus(orderNumber)
      setStatus(result as OrderStatus)
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [orderNumber])

  if (!status) return null

  const steps = [
    {
      title: 'Order Processing',
      icon: Package,
      completed: true,
    },
    {
      title: 'Order Shipped',
      icon: Truck,
      completed: status.status === 'shipped' || status.status === 'delivered',
    },
    {
      title: 'Order Delivered',
      icon: CheckCircle,
      completed: status.status === 'delivered',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 transform bg-muted" />
        <div
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 transform bg-primary transition-all duration-500"
          style={{
            width: `${
              ((steps.filter(step => step.completed).length - 1) /
                (steps.length - 1)) *
              100
            }%`,
          }}
        />
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                step.completed ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              <step.icon className="h-6 w-6" />
            </motion.div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border p-4">
        <h3 className="font-semibold">Tracking Information</h3>
        <div className="mt-2 space-y-2 text-sm">
          <p>Carrier: {status.tracking.carrier}</p>
          <p>Tracking Number: {status.tracking.number}</p>
          <p>
            Estimated Delivery:{' '}
            {new Date(status.estimatedDelivery).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}

