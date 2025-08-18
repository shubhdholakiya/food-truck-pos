import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Store, Bell, Shield, Palette } from "lucide-react";

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <p className="text-gray-600">
          Configure your restaurant settings, preferences, and system options
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>Restaurant Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="restaurant-name">Restaurant Name</Label>
                <Input
                  id="restaurant-name"
                  placeholder="Enter restaurant name"
                  defaultValue="FoodTruck POS"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="(555) 123-4567"
                  defaultValue=""
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter restaurant address"
                defaultValue=""
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@restaurant.com"
                  defaultValue=""
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://restaurant.com"
                  defaultValue=""
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="new-orders">New Order Notifications</Label>
                <p className="text-sm text-gray-600">Get notified when new orders are received</p>
              </div>
              <Switch id="new-orders" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="low-inventory">Low Inventory Alerts</Label>
                <p className="text-sm text-gray-600">Alert when items are running low</p>
              </div>
              <Switch id="low-inventory" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="daily-reports">Daily Reports</Label>
                <p className="text-sm text-gray-600">Receive daily sales and performance reports</p>
              </div>
              <Switch id="daily-reports" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Display & Theme</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-gray-600">Use dark theme for better visibility</p>
              </div>
              <Switch id="dark-mode" />
            </div>
            
            <div>
              <Label htmlFor="currency">Currency Format</Label>
              <Input
                id="currency"
                placeholder="USD"
                defaultValue="USD"
                className="max-w-xs"
              />
            </div>
            
            <div>
              <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                placeholder="8.5"
                defaultValue="8"
                className="max-w-xs"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-logout">Auto Logout</Label>
                <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
              </div>
              <Switch id="auto-logout" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="require-auth">Require Authentication</Label>
                <p className="text-sm text-gray-600">Require login for all POS operations</p>
              </div>
              <Switch id="require-auth" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}