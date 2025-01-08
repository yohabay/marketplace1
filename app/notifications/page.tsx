'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Package, Star, DollarSign, MessageSquare, X, Filter, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Notification {
  id: string
  type: 'order' | 'review' | 'offer' | 'message'
  title: string
  message: string
  time: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order Shipped',
    message: 'Your order #1234 has been shipped',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'review',
    title: 'New Review',
    message: 'Someone left a 5-star review on your listing',
    time: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'offer',
    title: 'Price Drop',
    message: 'An item in your wishlist is now 20% off',
    time: '1 day ago',
    read: true,
  },
  {
    id: '4',
    type: 'message',
    title: 'New Message',
    message: 'You have a new message from a buyer',
    time: '2 days ago',
    read: true,
  },
]

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'order':
      return Package
    case 'review':
      return Star
    case 'offer':
      return DollarSign
    case 'message':
      return MessageSquare
    default:
      return Bell
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')

  const filteredNotifications = notifications
    .filter(notification => {
      const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notification.message.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filter === 'all' || (filter === 'unread' && !notification.read)
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      const timeA = new Date(a.time).getTime()
      const timeB = new Date(b.time).getTime()
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB
    })

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">
          Stay updated with your latest activities
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4">
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                {filter === 'all' ? 'All' : 'Unread'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter('all')}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('unread')}>
                Unread
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ChevronDown className="mr-2 h-4 w-4" />
                Sort: {sortBy === 'newest' ? 'Newest' : 'Oldest'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('newest')}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                Oldest First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>
            You have {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground"
              >
                <Bell className="mb-2 h-12 w-12" />
                <p>No notifications found</p>
              </motion.div>
            ) : (
              filteredNotifications.map((notification) => {
                const Icon = getIcon(notification.type)
                return (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`
                      relative cursor-pointer rounded-lg p-4 transition-colors
                      ${notification.read ? 'bg-background' : 'bg-muted'}
                    `}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeNotification(notification.id)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="flex items-start gap-4">
                      <div className={`
                        rounded-full p-2
                        ${notification.read ? 'bg-muted' : 'bg-primary text-primary-foreground'}
                      `}>
                        <Icon className="h-4 w-4" />
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
                )
              })
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}

