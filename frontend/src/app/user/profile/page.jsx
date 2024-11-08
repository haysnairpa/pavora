'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Package, Settings, CreditCard } from 'lucide-react'
import UserLayout from '../layout'

// Mock data for demonstration
const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/placeholder.svg?height=100&width=100',
}

const orders = [
  { id: '1234', date: '2023-05-01', status: 'Delivered', total: 99.99 },
  { id: '5678', date: '2023-05-15', status: 'Shipped', total: 149.99 },
  { id: '9012', date: '2023-05-30', status: 'Processing', total: 79.99 },
]

export default function Profile() {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const router = useRouter()

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would typically handle updating the user's information
    console.log('Profile updated:', { name, email });
  };  

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
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
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
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View your recent orders here.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {orders.map(order => (
                      <div key={order.id} className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">Order #{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                        </div>
                        <div className="ml-auto font-medium">
                          ${order.total.toFixed(2)}
                        </div>
                        <div className="ml-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account settings and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive email about your account activity</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">Password</h3>
                      <p className="text-sm text-muted-foreground">Change your password</p>
                    </div>
                    <Button variant="outline">Update</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="destructive" className="w-full">Delete Account</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      </div>
    </UserLayout>
  )
}