'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Package, Truck, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ReviewModal } from "@/components/review-modal"

// Mock order data
const mockOrder = {
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
      seller: {
        id: 'SELLER1',
        name: 'Camera Enthusiast',
      }
    }
  ],
  tracking: {
    carrier: 'UPS',
    number: '1Z999AA1234567890',
    status: 'delivered',
    updates: [
      {
        date: '2024-01-07',
        status: 'delivered',
        location: 'San Francisco, CA',
      },
      {
        date: '2024-01-06',
        status: 'in_transit',
        location: 'Los Angeles, CA',
      },
      {
        date: '2024-01-05',
        status: 'processing',
        location: 'Warehouse',
      },
    ]
  },
  shipping: {
    address: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
  }
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [selectedItem, setSelectedItem] = useState<typeof mockOrder.items[0] | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewedItems, setReviewedItems] = useState<string[]>([])

  const handleReviewSubmit = (itemId: string) => {
    setReviewedItems(prev => [...prev, itemId])
    setIsReviewModalOpen(false)
    setSelectedItem(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return Package
      case 'in_transit':
        return Truck
      case 'delivered':
        return CheckCircle
      default:
        return Package
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Order #{mockOrder.id}</h1>
          <span className="text-muted-foreground">
            Placed on {new Date(mockOrder.date).toLocaleDateString()}
          </span>
        </div>

        {/* Order Status */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Order Status</h2>
          <div className="relative">
            <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 transform bg-muted" />
            <div
              className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 transform bg-primary transition-all duration-500"
              style={{
                width: mockOrder.tracking.status === 'delivered' ? '100%' : 
                       mockOrder.tracking.status === 'in_transit' ? '66%' : '33%'
              }}
            />
            <div className="relative flex justify-between">
              {mockOrder.tracking.updates.map((update, index) => {
                const StatusIcon = getStatusIcon(update.status)
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      update.status === mockOrder.tracking.status ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="font-medium">{update.status.replace('_', ' ').charAt(0).toUpperCase() + update.status.slice(1)}</p>
                      <p className="text-sm text-muted-foreground">{update.location}</p>
                      <p className="text-xs text-muted-foreground">{new Date(update.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Order Items</h2>
          <div className="space-y-4">
            {mockOrder.items.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
                <div className="flex flex-1 items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Sold by: {item.seller.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                    {mockOrder.status === 'delivered' && !reviewedItems.includes(item.id) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setSelectedItem(item)
                          setIsReviewModalOpen(true)
                        }}
                      >
                        Leave Review
                      </Button>
                    )}
                    {reviewedItems.includes(item.id) && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Review submitted
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Information */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Shipping Information</h2>
          <div className="space-y-2">
            <p>{mockOrder.shipping.address}</p>
            <p>
              {mockOrder.shipping.city}, {mockOrder.shipping.state} {mockOrder.shipping.zip}
            </p>
            {mockOrder.tracking && (
              <div className="mt-4">
                <p className="font-medium">Tracking Number:</p>
                <p className="font-mono">{mockOrder.tracking.carrier} - {mockOrder.tracking.number}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${mockOrder.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <span>${mockOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Review Modal */}
      {selectedItem && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false)
            setSelectedItem(null)
          }}
          productId={selectedItem.id}
          productTitle={selectedItem.title}
          sellerId={selectedItem.seller.id}
          onSubmitSuccess={() => handleReviewSubmit(selectedItem.id)}
        />
      )}
    </div>
  )
}

