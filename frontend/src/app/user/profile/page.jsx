'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Package, Settings } from 'lucide-react'
import UserLayout from '../layout'
import { Switch } from "@/components/ui/switch"

export default function Profile() {
  const [userData, setUserData] = useState(null)
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const parsedUser = JSON.parse(user)
      setUserData(parsedUser)
      setPreviewUrl(parsedUser.profileImage)
    } else {
      router.push('/auth/login')
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/auth/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: userData.username
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error (data.error)
      }

      localStorage.setItem('user', JSON.stringify({
        ...userData,
        username: userData.username
      }))

      alert('Profile updated successfully!')
    } catch (error) {
      alert(error.message)
    }
  };  

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/auth/update-profile-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      const updatedUserData = {
        ...userData,
        profileImage: data.profileImage
      };

      setUserData(updatedUserData);
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      setPreviewUrl(data.profileImage);

    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message);
      // Revert preview on error
      setPreviewUrl(userData?.profileImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  if (!userData) {
    return <div>Loading...</div>
  }

  return (
    <UserLayout>
      <div className="container mx-auto py-8 px-4 h-screen">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative group cursor-pointer">
                  <Avatar className="w-32 h-32 mb-4 transition-opacity group-hover:opacity-75">
                    <AvatarImage 
                      src={previewUrl || "/placeholder.svg"} 
                      alt={userData.username}
                      className="object-cover"
                    />
                    <AvatarFallback>{userData.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Input
                      type="file"
                      id="profileImage"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleImageUpload(file);
                      }}
                      disabled={isUploading}
                    />
                    <div 
                      onClick={() => !isUploading && document.getElementById('profileImage').click()}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full text-white text-sm font-medium"
                    >
                      {isUploading ? 'Uploading...' : 'Change Photo'}
                    </div>
                  </div>
                </div>
                <h2 className="text-xl font-semibold">{userData.username}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{userData.email}</p>
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-3/4">
            <Tabs defaultValue="personal-info">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal-info"><User className="mr-2 h-4 w-4" /> Personal Info</TabsTrigger>
                <TabsTrigger value="orders"><Package className="mr-2 h-4 w-4" /> Orders</TabsTrigger>
                <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" /> Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="personal-info">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit}>
                      <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="name">Name</Label>
                          <Input 
                            id="name" 
                            value={userData.username} 
                            onChange={(e) => setUserData({...userData, username: e.target.value})} 
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={userData.email} 
                            disabled 
                            className="bg-gray-100"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View your past orders and their status.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold">Order #{order.id}</p>
                                <p className="text-sm text-gray-500">{order.date}</p>
                                <p className="text-sm mt-2">Total: {rupiahFormat(order.total)}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <Button variant="outline" className="mt-4" size="sm">
                              View Details
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Package className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-semibold">No orders yet</h3>
                          <p className="mt-1 text-sm text-gray-500">Start shopping to see your orders here.</p>
                          <Button className="mt-4" onClick={() => router.push('/')}>
                            Browse Products
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Password Change Section */}
                    <div className="space-y-4">
                      <h3 className="font-medium">Change Password</h3>
                      <div className="grid gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input id="currentPassword" type="password" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                        <Button className="w-full md:w-auto">Update Password</Button>
                      </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="space-y-4">
                      <h3 className="font-medium">Notification Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-gray-500">Receive order updates and promotions</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>SMS Notifications</Label>
                            <p className="text-sm text-gray-500">Receive order updates via SMS</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    {/* Delete Account */}
                    <div className="pt-4 border-t">
                      <h3 className="font-medium text-red-600">Danger Zone</h3>
                      <p className="text-sm text-gray-500 mt-1">Once you delete your account, there is no going back.</p>
                      <Button variant="destructive" className="mt-4">Delete Account</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}