import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChefHat, Clock, CheckCircle, AlertTriangle, Flame } from "lucide-react";

export default function Kitchen() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <ChefHat className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Kitchen Display</h1>
        </div>
        <p className="text-gray-600">
          Real-time order management and preparation tracking for kitchen staff
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Flame className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">In Preparation</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Ready to Serve</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Avg Prep Time</p>
                <p className="text-2xl font-bold">0m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Orders</span>
              <Badge variant="secondary">Queue: 0</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-16">
              <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Kitchen is ready!</h3>
              <p className="text-gray-600 mb-6">
                New orders from the POS system and customer interface will appear here for preparation
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  View Order History
                </Button>
                <Button>
                  <Flame className="h-4 w-4 mr-2" />
                  Kitchen Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preparation Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Burgers</span>
                  <Badge variant="secondary">8 min</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Wraps</span>
                  <Badge variant="secondary">6 min</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tacos</span>
                  <Badge variant="secondary">10 min</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sides</span>
                  <Badge variant="secondary">4 min</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kitchen Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Grill Station</span>
                  <Badge className="bg-green-100 text-green-700">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Fryer</span>
                  <Badge className="bg-green-100 text-green-700">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Prep Station</span>
                  <Badge className="bg-green-100 text-green-700">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Beverage Station</span>
                  <Badge className="bg-green-100 text-green-700">Ready</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Orders Completed</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Prep Time</span>
                  <span className="font-medium">0m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Efficiency Score</span>
                  <span className="font-medium">100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}