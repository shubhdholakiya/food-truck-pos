import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Navigation, Clock, Truck } from "lucide-react";

export default function Locations() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Locations</h1>
            </div>
            <p className="text-gray-600">
              Manage your food truck locations, routes, and operating schedules
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Locations</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Truck className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Active Today</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Navigation className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Miles Traveled</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No current location set</h3>
              <p className="text-gray-600 mb-6">
                Set your food truck's current location to help customers find you
              </p>
              <Button>
                <MapPin className="h-4 w-4 mr-2" />
                Set Current Location
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Downtown Business District</h3>
                    <p className="text-sm text-gray-600 mb-2">123 Main Street, City Center</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Mon-Fri 11:30-2:30
                      </span>
                      <span>High traffic</span>
                    </div>
                  </div>
                  <Badge variant="secondary">Saved</Badge>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">University Campus</h3>
                    <p className="text-sm text-gray-600 mb-2">Student Union, University Ave</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Mon-Thu 12:00-8:00
                      </span>
                      <span>Student discount</span>
                    </div>
                  </div>
                  <Badge variant="secondary">Saved</Badge>
                </div>
              </div>

              <div className="text-center py-6">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Location
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schedule set</h3>
            <p className="text-gray-600 mb-6">
              Create a weekly schedule to let customers know when and where to find you
            </p>
            <Button>
              <Clock className="h-4 w-4 mr-2" />
              Create Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}