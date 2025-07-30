import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, Phone, QrCode } from "lucide-react";
import type { MenuItem, Category } from "@shared/schema";

export default function QRMenu() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: selectedCategory === "all" 
      ? ["/api/menu-items"] 
      : [`/api/menu-items?categoryId=${selectedCategory}`],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white p-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Store className="h-8 w-8" />
            <h1 className="text-2xl font-bold">FoodTruck POS</h1>
          </div>
          <p className="text-white/90">Scan • Browse • Order at Counter</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        {/* Order Instructions */}
        <Card className="mb-6 border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <QrCode className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">How to Order</h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Browse our menu below</li>
                  <li>Remember your favorites</li>
                  <li>Come to the counter to place your order</li>
                  <li>Pay and we'll prepare your fresh food!</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Menu</h2>
          <p className="text-gray-600">Fresh, delicious food made to order</p>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            size="sm"
          >
            All Items
          </Button>
          {(categories as any[]).map((category: any) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              size="sm"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Menu Items */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-6 bg-gray-200 rounded w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {(menuItems as any[]).map((item: any) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Store className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 mr-4">
                          <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                          {item.description && (
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          {item.ingredients && (
                            <p className="text-gray-500 text-xs mt-2">
                              {item.ingredients}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <div className="text-2xl font-bold text-primary">
                            ${item.price.toFixed(2)}
                          </div>
                          {item.isSpecial && (
                            <Badge className="mt-1 bg-accent text-white text-xs">
                              Special
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <Card className="mt-8 bg-primary text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-4">Ready to Order?</h3>
            <p className="mb-4 text-white/90">
              Come to our counter to place your order and enjoy fresh, delicious food!
            </p>
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <Phone className="h-4 w-4" />
              <span>(555) 123-FOOD</span>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 pb-8 text-gray-500 text-sm">
          <p>Powered by FoodTruck POS • Fresh ingredients • Made with love</p>
        </div>
      </div>
    </div>
  );
}