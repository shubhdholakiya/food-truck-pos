import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import type { TopSellingItem } from "@/types";

export default function TopItems() {
  const { toast } = useToast();

  const { data: topItems = [], isLoading } = useQuery({
    queryKey: ["/api/analytics/top-items?limit=3"],
  });

  if (isLoading) {
    return (
      <Card className="material-shadow">
        <CardHeader>
          <CardTitle>Top Selling Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="material-shadow">
      <CardHeader>
        <CardTitle>Top Selling Items</CardTitle>
      </CardHeader>
      <CardContent>
        {topItems.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No sales data available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-10 h-10 rounded-lg object-cover" 
                      />
                    ) : (
                      <span className="text-gray-500 text-xs">No Image</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.soldCount} sold today</p>
                  </div>
                </div>
                <p className="font-medium text-gray-900">${item.revenue.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
