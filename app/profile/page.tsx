'use client'

import { useState } from 'react'
import { Star, MapPin, Shield, Package } from 'lucide-react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditProfileModal } from "@/components/edit-profile-modal"

export default function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Photography enthusiast and vintage camera collector."
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Profile Sidebar */}
        <Card className="lg:col-span-4">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Image
                  src="/placeholder.svg"
                  alt="Profile picture"
                  width={128}
                  height={128}
                  className="rounded-full"
                />
                <Badge className="absolute bottom-0 right-0 h-6 w-6">
                  <Shield className="h-4 w-4" />
                </Badge>
              </div>
              <div className="space-y-1 text-center">
                <h1 className="text-2xl font-bold">{profileData.name}</h1>
                <p className="text-muted-foreground">Member since 2024</p>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 fill-primary text-primary"
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  (4.9 / 5)
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{profileData.location}</span>
              </div>
              <Button 
                className="w-full"
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit Profile
              </Button>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Sales</span>
                <span className="text-sm">142</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Active Listings</span>
                <span className="text-sm">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Positive Ratings</span>
                <span className="text-sm">98%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="listings">
            <TabsList>
              <TabsTrigger value="listings">Active Listings</TabsTrigger>
              <TabsTrigger value="sold">Sold Items</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="listings" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Card key={item} className="overflow-hidden">
                    <CardContent className="p-0">
                      <Image
                        src="/placeholder.svg"
                        alt="Product"
                        width={300}
                        height={200}
                        className="h-48 w-full object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold">Vintage Camera</h3>
                        <p className="text-sm text-muted-foreground">
                          Listed 2 days ago
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-bold">$299</span>
                          <Badge>Like New</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="sold">
              <div className="text-center text-muted-foreground">
                No sold items yet
              </div>
            </TabsContent>
            <TabsContent value="reviews">
              <div className="space-y-4">
                {[1, 2, 3].map((review) => (
                  <Card key={review}>
                    <CardContent className="flex items-start space-x-4 p-4">
                      <Image
                        src="/placeholder.svg"
                        alt="Reviewer"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">John Doe</h4>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="h-4 w-4 fill-primary text-primary"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Great seller! Item was exactly as described and shipping
                          was fast.
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Posted 3 days ago
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={profileData}
      />
    </div>
  )
}

