import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserPlus, Shield, Clock, Mail, Phone } from "lucide-react";

export default function Staff() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Staff Management</h1>
            </div>
            <p className="text-gray-600">
              Manage team members, roles, and permissions for your restaurant
            </p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Active Now</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Cashiers</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">Admin User</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          admin@restaurant.com
                        </span>
                        <span className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          (555) 123-4567
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge>Admin</Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Active
                    </Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Add more team members</h3>
                  <p className="text-gray-600 mb-4">
                    Invite staff members to help manage your restaurant operations
                  </p>
                  <Button variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Staff
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Admin</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Full access to all features and settings
                  </p>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">Manager</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Access to sales, inventory, and staff management
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-900">Cashier</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Access to POS system and basic order management
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Admin logged in</span>
                  <span className="text-xs text-gray-400 ml-auto">2 min ago</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Settings updated</span>
                  <span className="text-xs text-gray-400 ml-auto">1 hour ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}