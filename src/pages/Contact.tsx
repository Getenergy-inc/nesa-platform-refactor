import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Building2,
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mic,
  Video,
  Award,
  Upload,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@nesa-africa.org", "nominations@nesa-africa.org"],
    description: "For general inquiries and nomination support"
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+234 800 NESA AFRICA", "+27 11 XXX XXXX"],
    description: "Monday to Friday, 9am - 5pm WAT"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["SCEF House", "Victoria Island, Lagos, Nigeria"],
    description: "Pan-African Secretariat"
  },
  {
    icon: Clock,
    title: "Office Hours",
    details: ["Mon - Fri: 9:00 AM - 5:00 PM WAT", "Sat: 10:00 AM - 2:00 PM WAT"],
    description: "Closed on Sundays and public holidays"
  }
];

const departments = [
  { name: "General Inquiries", email: "info@nesa-africa.org" },
  { name: "Nominations", email: "nominations@nesa-africa.org" },
  { name: "Partnerships", email: "partners@nesa-africa.org" },
  { name: "Media & Press", email: "media@nesa-africa.org" },
  { name: "Volunteer Program", email: "volunteer@nesa-africa.org" },
  { name: "Chapter Support", email: "chapters@nesa-africa.org" },
  { name: "Presenter Applications", email: "gala@nesa-africa.org" },
];

const regionalOffices = [
  { region: "West Africa", city: "Lagos, Nigeria", phone: "+234 XXX XXX XXXX" },
  { region: "East Africa", city: "Nairobi, Kenya", phone: "+254 XXX XXX XXX" },
  { region: "Southern Africa", city: "Johannesburg, South Africa", phone: "+27 XX XXX XXXX" },
  { region: "North Africa", city: "Cairo, Egypt", phone: "+20 XX XXX XXXX" },
  { region: "Central Africa", city: "Kinshasa, DRC", phone: "+243 XXX XXX XXX" }
];

export default function Contact() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const subjectParam = searchParams.get("subject");
  const isPresenterApplication = subjectParam === "presenter";

  const [activeTab, setActiveTab] = useState<string>(isPresenterApplication ? "presenter" : "general");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    department: isPresenterApplication ? "Presenter Applications" : "",
    message: ""
  });

  const [presenterData, setPresenterData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    experience: "",
    languages: "",
    portfolioUrl: "",
    socialMedia: "",
    bio: "",
    motivation: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isPresenterApplication) {
      setActiveTab("presenter");
    }
  }, [isPresenterApplication]);

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll respond within 24-48 hours.",
    });
    
    setFormData({ name: "", email: "", subject: "", department: "", message: "" });
    setIsSubmitting(false);
  };

  const handlePresenterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Application Submitted!",
      description: "Thank you for applying to be a Gala presenter. Our team will review your application and contact you within 7 business days.",
    });
    
    setPresenterData({
      name: "",
      email: "",
      phone: "",
      country: "",
      experience: "",
      languages: "",
      portfolioUrl: "",
      socialMedia: "",
      bio: "",
      motivation: "",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-nesa-gold/20 via-background to-nesa-gold/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-nesa-gold/20 text-nesa-gold border-nesa-gold/30">
              Get in Touch
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Contact <span className="text-nesa-gold">NESA-Africa</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Have questions about nominations, partnerships, or want to get involved? 
              We're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-nesa-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-6 h-6 text-nesa-gold" />
                  </div>
                  <h3 className="font-semibold mb-2">{info.title}</h3>
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-sm font-medium">{detail}</p>
                  ))}
                  <p className="text-xs text-muted-foreground mt-2">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Departments */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Forms with Tabs */}
            <Card>
              <CardHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="general">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      General Inquiry
                    </TabsTrigger>
                    <TabsTrigger value="presenter">
                      <Mic className="mr-2 h-4 w-4" />
                      Presenter Application
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  {/* General Contact Form */}
                  <TabsContent value="general" className="mt-0">
                    <form onSubmit={handleGeneralSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <select
                          id="department"
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          required
                        >
                          <option value="">Select a department</option>
                          {departments.map((dept, index) => (
                            <option key={index} value={dept.name}>{dept.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="What is this regarding?"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Your message..."
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Presenter Application Form */}
                  <TabsContent value="presenter" className="mt-0">
                    <div className="mb-6 rounded-lg bg-primary/10 p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Mic className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Become a Gala Presenter</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        We're looking for dynamic presenters and anchors to host segments of the 
                        NESA-Africa Awards Gala. Share your experience and portfolio below.
                      </p>
                    </div>

                    <form onSubmit={handlePresenterSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="p-name">Full Name *</Label>
                          <Input
                            id="p-name"
                            placeholder="Your name"
                            value={presenterData.name}
                            onChange={(e) => setPresenterData({ ...presenterData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="p-email">Email Address *</Label>
                          <Input
                            id="p-email"
                            type="email"
                            placeholder="your@email.com"
                            value={presenterData.email}
                            onChange={(e) => setPresenterData({ ...presenterData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="p-phone">Phone Number *</Label>
                          <Input
                            id="p-phone"
                            type="tel"
                            placeholder="+234 XXX XXX XXXX"
                            value={presenterData.phone}
                            onChange={(e) => setPresenterData({ ...presenterData, phone: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="p-country">Country *</Label>
                          <Input
                            id="p-country"
                            placeholder="e.g. Nigeria"
                            value={presenterData.country}
                            onChange={(e) => setPresenterData({ ...presenterData, country: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="p-experience">Hosting/Presenting Experience *</Label>
                        <Textarea
                          id="p-experience"
                          placeholder="Describe your experience hosting events, TV shows, podcasts, or live broadcasts..."
                          rows={3}
                          value={presenterData.experience}
                          onChange={(e) => setPresenterData({ ...presenterData, experience: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="p-languages">Languages Spoken *</Label>
                          <Input
                            id="p-languages"
                            placeholder="e.g. English, French, Swahili"
                            value={presenterData.languages}
                            onChange={(e) => setPresenterData({ ...presenterData, languages: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="p-portfolio">Portfolio/Showreel URL</Label>
                          <Input
                            id="p-portfolio"
                            type="url"
                            placeholder="https://youtube.com/..."
                            value={presenterData.portfolioUrl}
                            onChange={(e) => setPresenterData({ ...presenterData, portfolioUrl: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="p-social">Social Media Handles</Label>
                        <Input
                          id="p-social"
                          placeholder="e.g. @yourhandle (Instagram, Twitter/X, LinkedIn)"
                          value={presenterData.socialMedia}
                          onChange={(e) => setPresenterData({ ...presenterData, socialMedia: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="p-bio">Short Bio *</Label>
                        <Textarea
                          id="p-bio"
                          placeholder="Tell us about yourself in 2-3 sentences..."
                          rows={2}
                          value={presenterData.bio}
                          onChange={(e) => setPresenterData({ ...presenterData, bio: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="p-motivation">Why do you want to host the NESA-Africa Gala? *</Label>
                        <Textarea
                          id="p-motivation"
                          placeholder="Share your motivation and what you would bring to the event..."
                          rows={3}
                          value={presenterData.motivation}
                          onChange={(e) => setPresenterData({ ...presenterData, motivation: e.target.value })}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting Application..." : (
                          <>
                            <Award className="w-4 h-4 mr-2" />
                            Submit Application
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Departments & Social */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-nesa-gold" />
                    Department Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {departments.map((dept, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                        <span className="font-medium">{dept.name}</span>
                        <a href={`mailto:${dept.email}`} className="text-nesa-gold hover:underline text-sm">
                          {dept.email}
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-nesa-gold" />
                    Follow Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-nesa-gold hover:text-black transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-nesa-gold hover:text-black transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-nesa-gold hover:text-black transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-nesa-gold hover:text-black transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Stay connected with NESA-Africa for the latest updates, 
                    nominee stories, and education excellence news.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Offices */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Regional Offices</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {regionalOffices.map((office, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <Badge className="mb-3 bg-nesa-gold/20 text-nesa-gold border-nesa-gold/30">
                    {office.region}
                  </Badge>
                  <p className="font-semibold">{office.city}</p>
                  <p className="text-sm text-muted-foreground">{office.phone}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
