import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GFAWalletIcon } from "@/components/ui/GFAWalletIcon";
import { ArrowLeft, ShoppingBag, CreditCard, CheckCircle } from "lucide-react";
import { getCartWithProducts, createOrder, clearLocalCart, type LocalCartItem } from "@/api/shop";
import { AGC_BONUS_RATE, IMPACT_DESTINATIONS, type ImpactDestination } from "@/types/shop";
import { toast } from "sonner";

const PAYMENT_METHODS = [
  "GFA Wallet",
  "Paystack",
  "Transactpay",
  "TapTap Send",
  "Zelle",
  "Bancable",
];

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<LocalCartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [impactDestination, setImpactDestination] = useState<ImpactDestination>("EDUAID_AFRICA");
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    const { items, total } = await getCartWithProducts();
    if (items.length === 0) {
      navigate("/shop/cart");
      return;
    }
    setCartItems(items);
    setTotal(total);
    setLoading(false);
  };

  const bonusAGC = Math.floor(total * AGC_BONUS_RATE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !fullName) {
      toast.error("Please fill in required fields");
      return;
    }

    setSubmitting(true);

    const orderItems = cartItems.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price_usd: item.product?.price_usd || 0,
      product_name: item.product?.name || "Product",
      product_image_url: item.product?.image_url || undefined,
    }));

    const { data: order, error } = await createOrder({
      email,
      full_name: fullName,
      phone: phone || undefined,
      impact_destination: impactDestination,
      referral_code: referralCode || undefined,
      items: orderItems,
    });

    if (error || !order) {
      toast.error(error || "Failed to create order");
      setSubmitting(false);
      return;
    }

    // Clear cart and redirect to order confirmation
    clearLocalCart();
    toast.success("Order created successfully!");
    navigate(`/shop/orders/${order.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading checkout...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | NESA-Africa Merchandise</title>
        <meta name="description" content="Complete your purchase and support education in Africa." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" asChild>
              <Link to="/shop/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Link>
            </Button>
            <h1 className="text-2xl font-display font-bold text-foreground">Checkout</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Info */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Impact Selection */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Choose Where Your Impact Goes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="impact">Impact Destination</Label>
                      <Select value={impactDestination} onValueChange={(v) => setImpactDestination(v as ImpactDestination)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {IMPACT_DESTINATIONS.map((dest) => (
                            <SelectItem key={dest.value} value={dest.value}>
                              {dest.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Referral */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Referral Code (Optional)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="referral">If someone referred you, enter their code</Label>
                      <Input
                        id="referral"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        placeholder="e.g. U-ABC123"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Pay in any currency — methods appear by location:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {PAYMENT_METHODS.map((method) => (
                        <Badge key={method} variant="secondary">
                          {method}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      If FX markup applies, it will be shown before you confirm.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="bg-card border-border sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Items */}
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.product_id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground truncate flex-1">
                            {item.product?.name} × {item.quantity}
                          </span>
                          <span className="text-foreground ml-2">
                            ${((item.product?.price_usd || 0) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg">
                        <span className="text-foreground">Total</span>
                        <span className="text-foreground">${total.toFixed(2)} USD</span>
                      </div>
                    </div>

                    {/* AGC Bonus */}
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-gold/10 border border-gold/30">
                      <GFAWalletIcon size={20} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">+{bonusAGC} Bonus AGC</p>
                        <p className="text-xs text-muted-foreground">Credited after payment confirmation</p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-gold text-secondary font-semibold"
                      disabled={submitting}
                    >
                      {submitting ? "Processing..." : "Place Order"}
                    </Button>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                        Receipts issued instantly after payment
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                        Bonus AGC credited after payment confirmation
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                        If refund occurs, credited AGC may be reversed
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>

        {/* AGC Disclaimer */}
        <section className="py-6 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <p className="text-xs text-warning">
                ⚠️ AGC is non-tradeable — no withdrawals, no cash-out, no payouts.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
