import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react";

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <User className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>
        <p className="text-gray-600">
          Manage your personal information and account preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl">AD</AvatarFallback>
            </Avatar>
            <h3 className="font-medium mb-1">Admin User</h3>
            <p className="text-sm text-gray-600 mb-4">Restaurant Administrator</p>
            <Button variant="outline" size="sm">
              Change Photo
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    placeholder="Enter your first name"
                    defaultValue="Admin"
                  />
                </div>
                <div>
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    placeholder="Enter your last name"
                    defaultValue="User"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  defaultValue="admin@restaurant.com"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    defaultValue=""
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    placeholder="Administrator"
                    defaultValue="Administrator"
                    disabled
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  rows={4}
                  defaultValue=""
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Account Type</span>
              </div>
              <Badge>Administrator</Badge>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Member Since</span>
              </div>
              <span className="text-sm text-gray-600">January 2025</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Email Status</span>
              </div>
              <Badge className="bg-green-100 text-green-700">Verified</Badge>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Location</span>
              </div>
              <span className="text-sm text-gray-600">Not specified</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              Update Password
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}