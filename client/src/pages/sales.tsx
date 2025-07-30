import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import OrderModal from "@/components/pos/OrderModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ShoppingCart, Clock, CheckCircle, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { OrderWithItems } from "@/types";

export default function Sales() {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "preparing":
        return <ShoppingCart className="h-4 w-4" />;
      case "ready":
        return <CheckCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-primary/10 text-primary";
      case "preparing":
        return "bg-accent/10 text-accent";
      case "ready":
        return "bg-secondary/10 text-secondary";
      case "completed":
        return "bg-secondary/10 text-secondary";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <TopBar />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 overflow-hidden">
          <div className="p-4 md:p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-2">Sales & Orders</h2>
                <p className="text-gray-600">Manage your orders and process payments</p>
              </div>
              <Button 
                onClick={() => setShowOrderModal(true)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </div>

            {/* Orders List */}
            <Card className="material-shadow">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded-lg" />
                      </div>
                    ))}
                  </div>
                ) : (orders as any[]).length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No orders yet</p>
                    <p className="text-sm text-gray-400 mb-4">Create your first order to get started</p>
                    <Button 
                      onClick={() => setShowOrderModal(true)}
                      variant="outline"
                    >
                      Create Order
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(orders as any[]).map((order: any) => (
                      <div 
                        key={order.id} 
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">
                              {order.orderItems?.length || 0} items
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${order.total}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <BottomNavigation />
      
      {showOrderModal && (
        <OrderModal 
          isOpen={showOrderModal} 
          onClose={() => setShowOrderModal(false)} 
        />
      )}
    </div>
  );
}
