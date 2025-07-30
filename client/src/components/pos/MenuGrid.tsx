import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import type { MenuItem, Category } from "@shared/schema";
import type { CartItem } from "@/types";

interface MenuGridProps {
  onAddToCart: (item: CartItem) => void;
}

export default function MenuGrid({ onAddToCart }: MenuGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: selectedCategory === "all" 
      ? ["/api/menu-items"] 
      : [`/api/menu-items?categoryId=${selectedCategory}`],
  });

  const handleAddToCart = (menuItem: MenuItem) => {
    const cartItem: CartItem = {
      id: `${menuItem.id}-${Date.now()}`, // Unique cart item ID
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: parseFloat(menuItem.price),
      quantity: 1,
      imageUrl: menuItem.imageUrl || undefined,
    };
    
    onAddToCart(cartItem);
    toast({
      title: "Item added",
      description: `${menuItem.name} added to cart`,
    });
  };

  return (
    <>
      {/* Categories */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          onClick={() => setSelectedCategory("all")}
          className="whitespace-nowrap"
        >
          All Items
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="whitespace-nowrap"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Menu Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 animate-pulse">
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-3" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No menu items available</p>
          <p className="text-sm text-gray-400">Add some items to your menu to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-surface rounded-xl p-4 cursor-pointer hover:bg-surface-variant transition-colors material-shadow"
              onClick={() => handleAddToCart(item)}
            >
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-32 object-cover rounded-lg" 
                  />
                ) : (
                  <span className="text-gray-500 text-sm">No Image</span>
                )}
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {item.description || "No description available"}
              </p>
              <p className="font-bold text-primary">${item.price}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
