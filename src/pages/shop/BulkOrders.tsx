import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Gift, CheckCircle, Send } from "lucide-react";
import { submitBulkOrderLead } from "@/api/shop";
import { toast } from "sonner";

const PRODUCTS = [
  "Impact Wristband",
  "Sticker Pack",
  "Lapel Pin / Badge",
  "Branded Cap",
  "Eco Tote Bag",
  "Classic T-Shirt",
  "Polo Shirt",
  "Desk Flag + Stand",
  "Hoodie / Sweatshirt",
  "Legacy Sponsor Jacket",
];

export default function BulkOrders() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [orgName, setOrgName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [country, setCountry] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [brandingRequest, setBrandingRequest] = useState("");
  const [notes, setNotes] = useState("");

  const handleProductToggle = (product: string) => {
    setSelectedProducts((prev) =>
      prev.includes(product)
        ? prev.filter((p) => p !== product)
        : [...prev, product]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orgName || !contactName || !contactEmail) {
      toast.error("Please fill in required fields");
      return;
    }

    setSubmitting(true);

    const { data, error } = await submitBulkOrderLead({
      organization_name: orgName,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone || undefined,
      country: country || undefined,
      estimated_quantity: quantity ? parseInt(quantity) : undefined,
      products_interested: selectedProducts,
      branding_request: brandingRequest || undefined,
      notes: notes || undefined,
    });

    if (error) {
      toast.error(error);
      setSubmitting(false);
      return;
    }

    toast.success("Request submitted successfully!");
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <PublicLayout>
        <Helmet>
          <title>Request Received | NESA-Africa Bulk Orders</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal flex items-center justify-center px-4">
          <Card className="max-w-md bg-card border-border">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Request Received!
              </h2>
              <p className="text-muted-foreground mb-6">
                Our team will review your bulk order request and get back to you within 2-3 business days.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <Helmet>
        <title>Bulk Corporate Orders | NESA-Africa Merchandise</title>
        <meta
          name="description"
          content="Request bulk merchandise orders for your organization. Perfect for staff gifts, CSR campaigns, and co-branded merchandise."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button variant="ghost" asChild>
              <Link to="/shop">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shop
              </Link>
            </Button>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-10">
              <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
                <Building2 className="h-3 w-3 mr-1" />
                Corporate & Bulk Orders
              </Badge>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Bulk Corporate Orders
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Perfect for staff gifts, CSR campaigns, and co-branded merchandise runs.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-4 mb-10">
              <Card className="bg-card/50 border-border">
                <CardContent className="pt-6 text-center">
                  <Gift className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium text-foreground mb-1">Co-Branded Merch</h3>
                  <p className="text-sm text-muted-foreground">Add your logo alongside NESA-Africa</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border">
                <CardContent className="pt-6 text-center">
                  <Building2 className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium text-foreground mb-1">Corporate Gift Packs</h3>
                  <p className="text-sm text-muted-foreground">Curated bundles for your team</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border">
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium text-foreground mb-1">Teacher Kit Sponsorship</h3>
                  <p className="text-sm text-muted-foreground">Sponsor education supplies</p>
                </CardContent>
              </Card>
            </div>

            {/* Form */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Request a Quote</CardTitle>
                <CardDescription>
                  Fill out the form below and our team will prepare a custom quote for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Organization */}
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name *</Label>
                    <Input
                      id="orgName"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="Your Company or Organization"
                      required
                    />
                  </div>

                  {/* Contact */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name *</Label>
                      <Input
                        id="contactName"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="United States"
                      />
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Estimated Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g. 100"
                      min="10"
                    />
                  </div>

                  {/* Products */}
                  <div className="space-y-3">
                    <Label>Products Interested In</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {PRODUCTS.map((product) => (
                        <div key={product} className="flex items-center gap-2">
                          <Checkbox
                            id={product}
                            checked={selectedProducts.includes(product)}
                            onCheckedChange={() => handleProductToggle(product)}
                          />
                          <label htmlFor={product} className="text-sm text-muted-foreground cursor-pointer">
                            {product}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Branding */}
                  <div className="space-y-2">
                    <Label htmlFor="branding">Branding Request</Label>
                    <Textarea
                      id="branding"
                      value={brandingRequest}
                      onChange={(e) => setBrandingRequest(e.target.value)}
                      placeholder="Describe any co-branding requirements (logo placement, colors, etc.)"
                      rows={3}
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any other requirements or questions"
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-gold text-secondary font-semibold"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Request Quote"}
                    <Send className="h-4 w-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
