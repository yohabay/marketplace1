'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Package, Star, DollarSign, MessageSquare } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

const mockNotifications = [
  {
    id: '1',
    type: 'order',
    title: 'Order Shipped',
    message: 'Your order #1234 has been shipped',
    icon: Package,
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'review',
    title: 'New Review',
    message: 'Someone left a 5-star review on your listing',
    icon: Star,
    time: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'offer',
    title: 'Price Drop',
    message: 'An item in your wishlist is now 20% off',
    icon: DollarSign,
    time: '1 day ago',
    read: true,
  },
  {
    id: '4',
    type: 'message',
    title: 'New Message',
    message: 'You have a new message from a buyer',
    icon: MessageSquare,
    time: '2 days ago',
    read: true,
  },
]

export function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Stay updated with your latest activities
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <AnimatePresence mode="popLayout">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => markAsRead(notification.id)}
                className={`
                  cursor-pointer rounded-lg p-4 transition-colors
                  ${notification.read ? 'bg-background' : 'bg-muted'}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    rounded-full p-2
                    ${notification.read ? 'bg-muted' : 'bg-primary text-primary-foreground'}
                  `}>
                    <notification.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

