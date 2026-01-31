import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GFAWalletIcon } from "@/components/ui/GFAWalletIcon";
import { CheckCircle, Package, Download, ArrowRight, Gift, Receipt } from "lucide-react";
import { getOrderById } from "@/api/shop";
import { IMPACT_DESTINATIONS, AGC_BONUS_RATE, type Order } from "@/types/shop";

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) loadOrder();
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;
    setLoading(true);
    const { data, error } = await getOrderById(id);
    if (data) {
      setOrder(data);
    }
    setLoading(false);
  };

  const impactLabel = IMPACT_DESTINATIONS.find(d => d.value === order?.impact_destination)?.label || "EduAid-Africa";
  const bonusAGC = order ? Math.floor(order.total_usd * AGC_BONUS_RATE) : 0;

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading order...</div>
        </div>
      </PublicLayout>
    );
  }

  if (!order) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal flex items-center justify-center">
          <Card className="max-w-md bg-card border-border">
            <CardContent className="pt-8 pb-6 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Order not found</h2>
              <Button asChild className="mt-4">
                <Link to="/shop">Back to Shop</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <Helmet>
        <title>Order Confirmed | NESA-Africa Merchandise</title>
        <meta name="description" content="Your order has been placed successfully." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                Order Confirmed!
              </h1>
              <p className="text-muted-foreground">
                Thank you for supporting education in Africa
              </p>
            </div>

            {/* Receipt Card */}
            <Card className="bg-card border-border mb-6">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Order Receipt
                  </CardTitle>
                  <Badge variant={order.status === "PAID" ? "default" : "secondary"}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Order Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Order ID</p>
                    <p className="font-mono text-foreground">{order.id.slice(0, 8)}...</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Receipt Number</p>
                    <p className="font-medium text-foreground">{order.receipt_number || "Pending"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="text-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Status</p>
                    <p className="text-foreground">{order.status}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-medium text-foreground mb-3">Items</h3>
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.product_name} × {item.quantity}
                        </span>
                        <span className="text-foreground">
                          ${(item.unit_price_usd * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${order.subtotal_usd.toFixed(2)}</span>
                  </div>
                  {order.fx_markup_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">FX Markup</span>
                      <span className="text-foreground">${order.fx_markup_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">${order.total_usd.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Impact */}
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Gift className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">Impact Destination</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{impactLabel}</p>
                </div>

                {/* AGC */}
                <div className="p-4 rounded-lg bg-gold/10 border border-gold/30">
                  <div className="flex items-center gap-3">
                    <GFAWalletIcon size={24} />
                    <div>
                      <p className="font-medium text-foreground">+{bonusAGC} Bonus AGC</p>
                      <p className="text-xs text-muted-foreground">
                        {order.status === "PAID" 
                          ? "Credited to your wallet" 
                          : "Will be credited after payment confirmation"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Download Receipt */}
                <Button variant="outline" className="w-full" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt (Coming Soon)
                </Button>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <h3 className="font-medium text-foreground mb-4">What's Next?</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">
                      You'll receive an email confirmation at <span className="text-foreground">{order.email}</span>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">
                      Your bonus AGC will be credited after payment is confirmed
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">
                      Track your AGC balance in your wallet dashboard
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  <Button asChild>
                    <Link to="/dashboard">
                      View Wallet
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-warning">
                ⚠️ AGC is non-tradeable — no withdrawals, no cash-out, no payouts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
