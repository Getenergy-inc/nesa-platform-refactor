import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GFAWalletIcon } from "@/components/ui/GFAWalletIcon";
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2, ShoppingBag, Package } from "lucide-react";
import { getCartWithProducts, updateLocalCartItem, removeFromLocalCart, clearLocalCart, type LocalCartItem } from "@/api/shop";
import { AGC_BONUS_RATE } from "@/types/shop";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<LocalCartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    const { items, total } = await getCartWithProducts();
    setCartItems(items);
    setTotal(total);
    setLoading(false);
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    updateLocalCartItem(productId, quantity);
    await loadCart();
  };

  const handleRemove = async (productId: string) => {
    removeFromLocalCart(productId);
    await loadCart();
  };

  const handleClearCart = () => {
    clearLocalCart();
    setCartItems([]);
    setTotal(0);
  };

  const bonusAGC = Math.floor(total * AGC_BONUS_RATE);

  return (
    <>
      <Helmet>
        <title>Shopping Cart | NESA-Africa Merchandise</title>
        <meta name="description" content="Review your cart and proceed to checkout." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" asChild>
              <Link to="/shop">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            <h1 className="text-2xl font-display font-bold text-foreground">Your Cart</h1>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-pulse text-muted-foreground">Loading cart...</div>
            </div>
          ) : cartItems.length === 0 ? (
            <Card className="max-w-md mx-auto bg-card border-border">
              <CardContent className="pt-12 pb-8 text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Add some merchandise to support education in Africa
                </p>
                <Button asChild>
                  <Link to="/shop">Browse Merchandise</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.product_id} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {item.product?.image_url ? (
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link to={`/shop/${item.product?.slug}`} className="hover:text-primary transition-colors">
                            <h3 className="font-medium text-foreground truncate">
                              {item.product?.name || "Product"}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            ${item.product?.price_usd} each
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleRemove(item.product_id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            ${((item.product?.price_usd || 0) * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-primary">
                            +{Math.floor((item.product?.price_usd || 0) * item.quantity * AGC_BONUS_RATE)} AGC
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={handleClearCart}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="bg-card border-border sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between font-semibold">
                        <span className="text-foreground">Total</span>
                        <span className="text-foreground">${total.toFixed(2)} USD</span>
                      </div>
                    </div>

                    {/* AGC Bonus */}
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/30">
                      <GFAWalletIcon size={20} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">+{bonusAGC} Bonus AGC</p>
                        <p className="text-xs text-muted-foreground">After payment</p>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-gradient-gold text-secondary font-semibold"
                      onClick={() => navigate("/shop/checkout")}
                    >
                      Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Pay in any currency • Instant receipt
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* AGC Disclaimer */}
        {cartItems.length > 0 && (
          <section className="py-6 bg-card/30">
            <div className="container mx-auto px-4">
              <div className="max-w-md mx-auto text-center">
                <p className="text-xs text-warning">
                  ⚠️ AGC is non-tradeable — no withdrawals, no cash-out, no payouts.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
