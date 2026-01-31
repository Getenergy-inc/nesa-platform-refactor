import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GFAWalletIcon } from "@/components/ui/GFAWalletIcon";
import { ShoppingCart, Gift, Heart, Building2, Sparkles, Package } from "lucide-react";
import { getProducts, addToLocalCart, getLocalCart } from "@/api/shop";
import { AGC_BONUS_RATE, type Product } from "@/types/shop";
import { toast } from "sonner";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "apparel", label: "Apparel" },
  { value: "accessories", label: "Accessories" },
  { value: "limited", label: "Limited Edition" },
];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProducts();
    updateCartCount();
  }, [category]);

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await getProducts(category);
    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const updateCartCount = () => {
    const cart = getLocalCart();
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  };

  const handleAddToCart = (product: Product) => {
    addToLocalCart(product.id, 1);
    updateCartCount();
    toast.success(`${product.name} added to cart`);
  };

  return (
    <>
      <Helmet>
        <title>Shop to Sponsor Impact | NESA-Africa Merchandise Store</title>
        <meta
          name="description"
          content="Shop official NESA-Africa merchandise and fund education impact across Africa. Every purchase supports EduAid-Africa + SCEF services, including Rebuild My School (2026–2027). Secure multi-currency checkout, instant receipts, and bonus voting credits."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal">
        {/* Hero */}
        <section className="relative py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
                <Gift className="h-3 w-3 mr-1" />
                Shop to Sponsor Impact
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
                Official NESA-Africa Merchandise
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                Every item you purchase helps fund{" "}
                <span className="text-primary">EduAid-Africa + SCEF services</span>, including{" "}
                <span className="text-gold">Rebuild My School (2026–2027)</span> — the NESA-Africa Legacy Project.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <Button size="lg" className="bg-gradient-gold text-secondary font-semibold" asChild>
                  <a href="#products">
                    <Package className="mr-2 h-5 w-5" />
                    Shop Now
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/shop/bulk-orders">
                    <Building2 className="mr-2 h-5 w-5" />
                    Bulk Corporate Orders
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" asChild>
                  <Link to="/donate">
                    <Heart className="mr-2 h-5 w-5" />
                    Sponsor Teacher Kits
                  </Link>
                </Button>
              </div>

              {/* Bonus AGC Banner */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                <GFAWalletIcon size={20} />
                <span className="text-sm font-medium text-foreground">
                  <span className="text-gold">${1} = {AGC_BONUS_RATE} Bonus AGC</span>
                  {" "}credited after payment
                </span>
                <Badge variant="secondary" className="text-xs">Non-tradeable</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section id="products" className="py-12">
          <div className="container mx-auto px-4">
            {/* Category Filter */}
            <div className="flex items-center justify-between mb-8">
              <Tabs value={category} onValueChange={setCategory}>
                <TabsList>
                  {CATEGORIES.map((cat) => (
                    <TabsTrigger key={cat.value} value={cat.value}>
                      {cat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Cart Button */}
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

            {/* Price Note */}
            <p className="text-sm text-muted-foreground mb-6">
              Prices shown in USD. Pay in any currency—your final total is shown before confirmation.
            </p>

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Card key={i} className="bg-card/50 animate-pulse">
                    <div className="aspect-square bg-muted"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-6 bg-muted rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="bg-card border-border group hover:border-primary/50 transition-colors overflow-hidden">
                    <Link to={`/shop/${product.slug}`}>
                      <div className="aspect-square bg-muted relative overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-gold/20">
                            <Package className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        {product.is_limited && (
                          <Badge className="absolute top-2 left-2 bg-gold text-secondary">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Limited
                          </Badge>
                        )}
                      </div>
                    </Link>
                    <CardContent className="p-4">
                      <Link to={`/shop/${product.slug}`}>
                        <h3 className="font-medium text-foreground text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-foreground">${product.price_usd}</span>
                        <Button size="sm" onClick={() => handleAddToCart(product)}>
                          Add
                        </Button>
                      </div>
                      <p className="text-xs text-primary mt-2">
                        +{Math.floor(product.price_usd * AGC_BONUS_RATE)} AGC bonus
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* AGC Disclaimer */}
        <section className="py-8 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 text-center">
                <p className="text-sm text-warning font-medium mb-1">
                  ⚠️ AGC is Non-Tradeable Voting Credit
                </p>
                <p className="text-xs text-muted-foreground">
                  No withdrawals, no cash-out, no payouts. AGC is used exclusively for voting within the NESA-Africa/SCEF ecosystem.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-gold/10">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                Shop. Wear the mission. Fund the legacy.
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                <Button size="lg" className="bg-gradient-gold text-secondary font-semibold" asChild>
                  <a href="#products">Shop Now</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/shop/bulk-orders">Bulk Corporate Orders</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
