import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, TrendingUp, Wallet } from "lucide-react";

export default function Payments() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <CreditCard className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Payments</h1>
        </div>
        <p className="text-gray-600">
          Track payment methods, transaction history, and revenue analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-bold">$0.00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Card Payments</p>
                <p className="text-2xl font-bold">$0.00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Wallet className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Cash Payments</p>
                <p className="text-2xl font-bold">$0.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Stripe</span>
                </div>
                <Badge variant="secondary">Connected</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Wallet className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Cash</span>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
              <p className="text-gray-600 mb-6">
                Payment transactions will be displayed here once orders are processed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}