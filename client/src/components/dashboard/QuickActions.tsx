import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, HandPlatter, Package, AlertTriangle, Clock } from "lucide-react";
import OrderModal from "@/components/pos/OrderModal";

export default function QuickActions() {
  const [showOrderModal, setShowOrderModal] = useState(false);

  return (
    <>
      <Card className="material-shadow">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button 
              className="w-full flex items-center space-x-3 bg-primary text-white hover:bg-primary/90"
              onClick={() => setShowOrderModal(true)}
            >
              <Plus className="h-5 w-5" />
              <span>New Order</span>
            </Button>
            <Button 
              variant="secondary" 
              className="w-full flex items-center space-x-3 bg-secondary text-white hover:bg-secondary/90"
            >
              <HandPlatter className="h-5 w-5" />
              <span>Kitchen Display</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full flex items-center space-x-3"
            >
              <Package className="h-5 w-5" />
              <span>Check Inventory</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="material-shadow">
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertTriangle className="text-destructive h-5 w-5 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Low Stock Alert</p>
                <p className="text-sm text-gray-600">Some items are running low</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <Clock className="text-accent h-5 w-5 mt-0.5" />
              <div>
                <p className="font-medium text-accent">Order Delayed</p>
                <p className="text-sm text-gray-600">Some orders taking longer than usual</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showOrderModal && (
        <OrderModal 
          isOpen={showOrderModal} 
          onClose={() => setShowOrderModal(false)} 
        />
      )}
    </>
  );
}
