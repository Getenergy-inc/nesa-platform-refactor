import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useSeason } from "@/contexts/SeasonContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Crown,
  MapPin,
  Minus,
  Plus,
  Shield,
  Sparkles,
  Star,
  Ticket,
  Trophy,
  Users,
  Utensils,
  Wifi,
} from "lucide-react";

import galaHeroImage from "@/assets/events/award-gala.jpeg";
import { GALA_EVENT } from "@/config/galaConfig";
import {
  PROGRAMME_END_LABEL,
  PROGRAMME_END_LONG_LABEL,
  PROGRAMME_END_DATE,
} from "@/config/programme";
import {
  getGalaJourneyMilestones,
  MASTER_TIMELINE_TRACK_LABELS,
} from "@/data/masterTimeline2026";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TicketTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  icon: typeof Star;
  popular?: boolean;
  soldOut?: boolean;
  maxPerOrder: number;
}

const ticketTiers: TicketTier[] = [
  {
    id: "standard",
    name: "Standard",
    price: 150,
    currency: "USD",
    description: "General admission to the Awards Gala",
    features: [
      "General seating area",
      "Live ceremony viewing",
      "Welcome drink",
      "Digital event program",
    ],
    icon: Ticket,
    maxPerOrder: 10,
  },
  {
    id: "premium",
    name: "Premium",
    price: 350,
    currency: "USD",
    description: "Enhanced experience with priority seating",
    features: [
      "Priority front-section seating",
      "3-course dinner included",
      "Complimentary bar access",
      "Meet & greet opportunity",
      "Premium gift bag",
      "Photo opportunity area",
    ],
    icon: Star,
    popular: true,
    maxPerOrder: 8,
  },
  {
    id: "vip",
    name: "VIP",
    price: 750,
    currency: "USD",
    description: "Exclusive access with VIP privileges",
    features: [
      "VIP front-row seating",
      "Private VIP lounge access",
      "Gourmet dinner experience",
      "Unlimited premium bar",
      "Red carpet photo session",
      "Backstage tour",
      "Exclusive nominee meet & greet",
      "Luxury gift collection",
    ],
    icon: Crown,
    maxPerOrder: 4,
  },
  {
    id: "corporate",
    name: "Corporate Table",
    price: 5000,
    currency: "USD",
    description: "Full table for 10 guests with branding",
    features: [
      "Reserved table for 10 guests",
      "Premium table placement",
      "Company logo on table display",
      "Acknowledgment during ceremony",
      "VIP lounge access for all guests",
      "Full catering & bar service",
      "Professional table photography",
      "Priority networking opportunities",
    ],
    icon: Users,
    maxPerOrder: 2,
  },
];

// Event facts come from the canonical gala config — never retyped here.
const eventDetails = {
  date: `Sunday, ${PROGRAMME_END_LABEL}`,
  time: GALA_EVENT.time,
  venue: GALA_EVENT.venue,
  city: GALA_EVENT.city,
  dressCode: GALA_EVENT.dressCode,
};

const TICKET_FAQS: { q: string; a: string }[] = [
  {
    q: "When and where is the Gala?",
    a: `${PROGRAMME_END_LONG_LABEL}, from ${GALA_EVENT.time}. ${GALA_EVENT.venue} — the exact venue is confirmed to ticket holders by email before the event.`,
  },
  {
    q: "Is the Gala the same as the TV Showcases?",
    a: "No. TV Showcase 1 (Sunday, 22 November 2026) and TV Showcase 2 (Tuesday, 8 December 2026) are broadcast programmes, not ticketed physical events. Your ticket admits you to the physical Recognition Gala in Lagos on 13 December 2026 only.",
  },
  {
    q: "Does buying a ticket affect nominations, judging or recognition?",
    a: "No. A ticket is admission to an event and nothing more. It confers no nomination, judging, voting or selection rights, and has no bearing on any recognition outcome.",
  },
  {
    q: "When do nominations open and close?",
    a: "Public nominations open 6 September 2026. Africa Education Icon nominations close 6 October 2026; Gold-Blue Garnet, Platinum and Influencer Education Impact nominations close 21 November 2026.",
  },
  {
    q: "When are the Africa Education Icon recipients known?",
    a: "All nine Africa Education Icon recipients are confirmed on 24 November 2026, ahead of TV Showcase 2 and the Gala.",
  },
  {
    q: "How do I receive my ticket?",
    a: "You receive a confirmation email with payment instructions, followed by your receipt and QR e-ticket. Bring the QR e-ticket to the Gala on 13 December 2026.",
  },
];

export default function Tickets() {
  const { currentEdition } = useSeason();
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<string>("premium");
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const journeyMilestones = getGalaJourneyMilestones();
  const selectedTicket = ticketTiers.find((t) => t.id === selectedTier);
  const subtotal = selectedTicket ? selectedTicket.price * quantity : 0;
  const processingFee = Math.round(subtotal * 0.035);
  const total = subtotal + processingFee;

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && selectedTicket && newQty <= selectedTicket.maxPerOrder) {
      setQuantity(newQty);
    }
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast({
      title: "Reservation Confirmed!",
      description: `Your ${quantity}x ${selectedTicket?.name} ticket(s) for the Gala on ${PROGRAMME_END_LABEL} (Lagos, Nigeria) have been reserved. Check your email for payment instructions.`,
    });
    setIsProcessing(false);
  };

  return (
    <>
      <Helmet>
        <title>{`Gala Tickets · ${PROGRAMME_END_LABEL} · NESA-Africa 2026`}</title>
        <meta
          name="description"
          content={`Buy tickets for the NESA-Africa 2026 Gold-Blue Garnet Awards Gala on ${PROGRAMME_END_LONG_LABEL}. Attendance only — tickets confer no nomination, judging or voting rights.`}
        />
        <meta property="og:title" content={`Gala Tickets · ${PROGRAMME_END_LABEL} · NESA-Africa 2026`} />
        <meta
          property="og:description"
          content={`NESA-Africa 2026 Gold-Blue Garnet Awards Gala — ${PROGRAMME_END_LONG_LABEL}.`}
        />
        <meta property="og:type" content="event" />
        <meta property="og:url" content="https://nesaafrica.lovable.app/tickets" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: GALA_EVENT.name,
            startDate: `${PROGRAMME_END_DATE}T18:00:00+01:00`,
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: { "@type": "Place", name: GALA_EVENT.venue, address: GALA_EVENT.city },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="relative h-64 overflow-hidden">
          <img
            src={galaHeroImage}
            alt="NESA-Africa Awards Gala"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <Link
                to="/media/gala"
                className="mb-4 inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Gala
              </Link>
              <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
                Get Your <span className="text-primary">Gala Tickets</span>
              </h1>
              <p className="mt-2 text-sm text-white/80 md:text-base">
                NESA-Africa 2026 Gold-Blue Garnet Awards Gala · {PROGRAMME_END_LONG_LABEL}
              </p>
            </div>
          </div>
        </section>

        <main className="container mx-auto px-4 py-12">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Ticket Selection */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Info */}
              <Card>
                <CardContent className="flex flex-wrap gap-6 pt-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{eventDetails.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{eventDetails.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Venue</p>
                      <p className="font-medium">{eventDetails.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Dress Code</p>
                      <p className="font-medium">{eventDetails.dressCode}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Your Journey to the Gala — derived from the /timeline master calendar */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Journey to the Gala</CardTitle>
                  <CardDescription>
                    Key milestones of the NESA-Africa 2026 recognition cycle.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {journeyMilestones.map((m) => (
                      <li key={m.id} className="flex gap-3">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        <div>
                          <p className="text-sm font-medium">{m.milestone}</p>
                          <p className="text-xs text-muted-foreground">
                            {m.dateLabel} · {MASTER_TIMELINE_TRACK_LABELS[m.track]}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <Button asChild variant="outline" size="sm" className="mt-5">
                    <Link to="/timeline">View the full programme</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Gala vs TV Showcases + rights disclaimer */}
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle className="text-base">What your ticket is — and is not</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Includes:</strong> physical
                    admission to the NESA-Africa 2026 Gold-Blue Garnet Awards Gala on{" "}
                    {PROGRAMME_END_LONG_LABEL}, plus the seating and hospitality listed
                    in your chosen tier.
                  </p>
                  <p>
                    <strong className="text-foreground">Does not include:</strong> any
                    nomination, judging, voting or selection right. Buying a ticket has
                    no bearing whatsoever on who is nominated, verified or recognised.
                  </p>
                  <p>
                    <strong className="text-foreground">Not the TV Showcases:</strong>{" "}
                    TV Showcase 1 (22 November 2026) and TV Showcase 2 (8 December 2026)
                    are separate broadcast programmes — they are not ticketed and are not
                    the Gala.
                  </p>
                </CardContent>
              </Card>

              {/* Ticket Tiers */}
              <div>
                <h2 className="mb-6 text-xl font-bold">Select Your Ticket</h2>
                <RadioGroup value={selectedTier} onValueChange={(v) => { setSelectedTier(v); setQuantity(1); }}>
                  <div className="grid gap-4 md:grid-cols-2">
                    {ticketTiers.map((tier) => {
                      const Icon = tier.icon;
                      const isSelected = selectedTier === tier.id;

                      return (
                        <Label
                          key={tier.id}
                          htmlFor={tier.id}
                          className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          } ${tier.soldOut ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                          {tier.popular && (
                            <Badge className="absolute -top-3 left-4 bg-primary text-primary-foreground">
                              Most Popular
                            </Badge>
                          )}
                          {tier.soldOut && (
                            <Badge variant="secondary" className="absolute -top-3 left-4">
                              Sold Out
                            </Badge>
                          )}

                          <div className="flex items-start gap-4">
                            <RadioGroupItem
                              value={tier.id}
                              id={tier.id}
                              disabled={tier.soldOut}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <Icon className="h-5 w-5 text-primary" />
                                <span className="font-semibold">{tier.name}</span>
                              </div>
                              <p className="mb-3 text-2xl font-bold">
                                ${tier.price.toLocaleString()}
                                <span className="text-sm font-normal text-muted-foreground">
                                  {" "}/ {tier.id === "corporate" ? "table" : "person"}
                                </span>
                              </p>
                              <p className="mb-4 text-sm text-muted-foreground">
                                {tier.description}
                              </p>
                              <ul className="space-y-2">
                                {tier.features.slice(0, 4).map((feature, i) => (
                                  <li key={i} className="flex items-center gap-2 text-sm">
                                    <Check className="h-4 w-4 text-success" />
                                    {feature}
                                  </li>
                                ))}
                                {tier.features.length > 4 && (
                                  <li className="text-sm text-muted-foreground">
                                    +{tier.features.length - 4} more benefits
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </Label>
                      );
                    })}
                  </div>
                </RadioGroup>
              </div>

              {/* Quantity */}
              {selectedTicket && !selectedTicket.soldOut && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quantity</CardTitle>
                    <CardDescription>
                      Maximum {selectedTicket.maxPerOrder} {selectedTicket.id === "corporate" ? "tables" : "tickets"} per order
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center text-xl font-bold">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= selectedTicket.maxPerOrder}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {TICKET_FAQS.map((f, i) => (
                      <AccordionItem key={f.q} value={`faq-${i}`}>
                        <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                          {f.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>
                    Gala · {PROGRAMME_END_LONG_LABEL}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedTicket && (
                    <>
                      <div className="flex justify-between">
                        <span>
                          {selectedTicket.name} × {quantity}
                        </span>
                        <span>${subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Processing fee (3.5%)</span>
                        <span>${processingFee.toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${total.toLocaleString()} USD</span>
                      </div>

                      <Button
                        onClick={handlePurchase}
                        disabled={isProcessing || selectedTicket.soldOut}
                        className="w-full bg-primary text-primary-foreground"
                        size="lg"
                      >
                        {isProcessing ? (
                          "Processing..."
                        ) : (
                          <>
                            <Ticket className="mr-2 h-5 w-5" />
                            Reserve Tickets
                          </>
                        )}
                      </Button>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        <span>Secure checkout. Payment instructions sent via email.</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Venue Amenities */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base">Venue Amenities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { icon: Wifi, label: "Free Wi-Fi" },
                    { icon: Utensils, label: "Catering Available" },
                    { icon: Shield, label: "24/7 Security" },
                    { icon: MapPin, label: "Valet Parking" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 text-sm">
                      <item.icon className="h-4 w-4 text-primary" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
