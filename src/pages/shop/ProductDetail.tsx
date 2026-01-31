import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GFAWalletIcon } from "@/components/ui/GFAWalletIcon";
import { ShoppingCart, Minus, Plus, ArrowLeft, Sparkles, Package, Gift, CheckCircle } from "lucide-react";
import { getProductBySlug, addToLocalCart, getLocalCart } from "@/api/shop";
import { AGC_BONUS_RATE, IMPACT_DESTINATIONS, type Product } from "@/types/shop";
import { toast } from "sonner";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) loadProduct();
    updateCartCount();
  }, [slug]);

  const loadProduct = async () => {
    if (!slug) return;
    setLoading(true);
    const { data, error } = await getProductBySlug(slug);
    if (data) {
      setProduct(data);
    } else {
      navigate("/shop");
    }
    setLoading(false);
  };

  const updateCartCount = () => {
    const cart = getLocalCart();
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToLocalCart(product.id, quantity);
    updateCartCount();
    toast.success(`${quantity}x ${product.name} added to cart`);
  };

  const impactLabel = IMPACT_DESTINATIONS.find(d => d.value === product?.impact_default)?.label || "EduAid-Africa";

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </PublicLayout>
    );
  }

  if (!product) return null;

  return (
    <PublicLayout>
      <Helmet>
        <title>{product.name} | NESA-Africa Merchandise</title>
        <meta name="description" content={product.description || `Shop ${product.name} and support education in Africa.`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" asChild>
              <Link to="/shop">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shop
              </Link>
            </Button>
            <Button variant="outline" asChild className="relative">
              <Link to="/shop/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>

          {/* Product Detail */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Image */}
            <div className="aspect-square rounded-xl overflow-hidden bg-card border border-border">
              {product.image_url ? (
                <img
                  src={`${product.image_url}?v=2`}
                  alt={product.name}
                  className="w-full h-full object-cover bg-card"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-gold/20 ${product.image_url ? 'hidden' : ''}`}>
                <Package className="h-24 w-24 text-muted-foreground" />
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                {product.is_limited && (
                  <Badge className="mb-3 bg-gold text-secondary">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Limited Edition
                  </Badge>
                )}
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                  {product.name}
                </h1>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-foreground">${product.price_usd}</span>
                <span className="text-sm text-muted-foreground">USD</span>
              </div>

              {/* Impact */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">Impact Allocation</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This purchase supports: <span className="text-primary">{impactLabel}</span>
                  </p>
                </CardContent>
              </Card>

              {/* AGC Bonus */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-gold/10 border border-gold/30">
                <GFAWalletIcon size={24} />
                <div>
                  <p className="font-medium text-foreground">
                    +{Math.floor(product.price_usd * quantity * AGC_BONUS_RATE)} Bonus AGC
                  </p>
                  <p className="text-xs text-muted-foreground">Credited after payment confirmation</p>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Quantity</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                size="lg"
                className="w-full bg-gradient-gold text-secondary font-semibold"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart — ${(product.price_usd * quantity).toFixed(2)}
              </Button>

              {/* Trust */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Pay in any currency
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Instant receipt after payment
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Supports education across Africa
                </div>
              </div>
            </div>
          </div>
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
    </PublicLayout>
  );
}
