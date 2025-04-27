
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Utensils } from "lucide-react";
import { toast } from "sonner";
import { usePoints } from "@/contexts/points/PointsContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

const FoodMenu: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<FoodItem[]>([]);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const { stats, redeemReward } = usePoints();

  useEffect(() => {
    const fetchFoodItems = async () => {
      const { data, error } = await supabase.from('food_items').select('*');
      if (data) setFoodItems(data);
    };
    fetchFoodItems();
  }, []);

  const addToCart = (item: FoodItem) => {
    setCart([...cart, item]);
    toast.success(`Added ${item.name} to cart`, {
      description: `${item.price} points`
    });
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const totalPoints = cart.reduce((sum, item) => sum + item.price, 0);
    
    if (totalPoints > stats.pointsAvailable) {
      toast.error("Not enough points available", {
        description: `You need ${totalPoints - stats.pointsAvailable} more points`
      });
      return;
    }

    try {
      // Create a custom reward for the food items
      const orderDescription = cart.map(item => item.name).join(", ");
      
      // Use the redeemReward system to deduct points
      redeemReward("food-order-" + Date.now());
      
      // Get the current user's ID
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");
      
      const { data: orderData, error: orderError } = await supabase
        .from('food_orders')
        .insert({ 
          total_amount: totalPoints,
          status: 'pending',
          user_id: userData.user.id
        })
        .select('id')
        .single();

      if (orderError) throw orderError;

      const orderItemsPromises = cart.map(item => 
        supabase.from('food_order_items').insert({
          order_id: orderData.id,
          food_item_id: item.id,
          quantity: 1,
          price: item.price
        })
      );

      await Promise.all(orderItemsPromises);

      // Close dialog and show success message
      setIsOrderDialogOpen(false);
      
      toast.success("Order placed successfully!", {
        description: `Your food will be delivered to the provided address.`
      });

      setCart([]);
      setAddress("");
      setAdditionalNotes("");
    } catch (error) {
      toast.error("Failed to place order");
      console.error("Order error:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils /> Food Menu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foodItems.map((item) => (
            <div 
              key={item.id} 
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-semibold">
                    {item.price} points
                  </span>
                  <Button 
                    size="sm" 
                    onClick={() => addToCart(item)}
                    variant="outline"
                    disabled={item.price > stats.pointsAvailable}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h4 className="font-bold mb-2">Cart</h4>
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span>{item.name}</span>
                <span>{item.price} points</span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-2">
              <span>Total</span>
              <span>
                {cart.reduce((sum, item) => sum + item.price, 0)} points
              </span>
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => setIsOrderDialogOpen(true)}
              disabled={cart.reduce((sum, item) => sum + item.price, 0) > stats.pointsAvailable}
            >
              Redeem with Points
            </Button>
          </div>
        )}
        
        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Your Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea 
                  id="address" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="Enter your full address"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Input 
                  id="notes" 
                  value={additionalNotes} 
                  onChange={(e) => setAdditionalNotes(e.target.value)} 
                  placeholder="Any special instructions?"
                />
              </div>
              <div className="border-t pt-4">
                <h4 className="font-bold mb-4">Order Summary</h4>
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between mb-2">
                    <span>{item.name}</span>
                    <span>{item.price} points</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                  <span>Total</span>
                  <span>{cart.reduce((sum, item) => sum + item.price, 0)} points</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>Cancel</Button>
              <Button onClick={placeOrder} disabled={!address.trim()}>Place Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default FoodMenu;
