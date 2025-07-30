import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Receipt, DollarSign, AlertTriangle } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import type { SalesMetrics } from "@/types";

export default function MetricsCards() {
  const { toast } = useToast();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/analytics/metrics"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="material-shadow animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Today's Sales",
      value: `$${Number(metrics?.todaySales || 0).toFixed(2)}`,
      change: "+12.5% from yesterday",
      changeColor: "text-secondary",
      icon: TrendingUp,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Orders",
      value: Number(metrics?.totalOrders || 0).toString(),
      change: "3 pending",
      changeColor: "text-secondary",
      icon: Receipt,
      iconBg: "bg-secondary/10",
      iconColor: "text-secondary",
    },
    {
      title: "Average Order",
      value: `$${Number(metrics?.avgOrder || 0).toFixed(2)}`,
      change: "-2.1% from last week",
      changeColor: "text-accent",
      icon: DollarSign,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      title: "Low Stock Items",
      value: Number(metrics?.lowStockCount || 0).toString(),
      change: "Needs attention",
      changeColor: "text-destructive",
      icon: AlertTriangle,
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="material-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className={`text-sm font-medium ${card.changeColor}`}>{card.change}</p>
                </div>
                <div className={`${card.iconBg} p-3 rounded-full`}>
                  <Icon className={`${card.iconColor} h-6 w-6`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
