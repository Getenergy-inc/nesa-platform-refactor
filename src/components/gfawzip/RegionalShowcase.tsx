import { Badge } from "@/components/ui/badge";
import { GFAWalletIcon } from "@/components/ui/GFAWalletIcon";
import southernAfricanImage from "@/assets/gfawzip-southern-african.jpg";
import northernAfricanImage from "@/assets/gfawzip-northern-african.jpg";
import eastAfricanImage from "@/assets/gfawzip-east-african.jpg";

interface RegionStory {
  region: string;
  flag: string;
  title: string;
  description: string;
  image: string;
}

const REGION_STORIES: RegionStory[] = [
  {
    region: "Southern Africa",
    flag: "🇿🇦",
    title: "Joy of Seamless Payments",
    description: "From Johannesburg to Cape Town, supporters celebrate easy mobile payments with GFAWzip.",
    image: southernAfricanImage,
  },
  {
    region: "Northern Africa",
    flag: "🇪🇬",
    title: "Supporting NESA-Africa 2025",
    description: "From the Sahara to the Mediterranean, connecting Africa through digital finance.",
    image: northernAfricanImage,
  },
  {
    region: "East Africa",
    flag: "🇰🇪",
    title: "Empowering Communities",
    description: "From Ethiopia's highlands to Kenya's farms, financial inclusion reaches every corner.",
    image: eastAfricanImage,
  },
];

export function RegionalShowcase() {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Across the Continent</Badge>
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">
            GFAWzip Connects All of Africa
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From North to South, East to West — supporting NESA-Africa changemakers through seamless payments.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {REGION_STORIES.map((story) => (
            <div key={story.region} className="group">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border bg-card">
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                {/* GFA Logo Overlay */}
                <div className="absolute top-3 right-3 p-1.5 bg-card/90 backdrop-blur-sm rounded-lg shadow-md border border-border">
                  <GFAWalletIcon size={24} />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{story.flag}</span>
                    <Badge variant="outline" className="text-xs">
                      {story.region}
                    </Badge>
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">
                    {story.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {story.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">One wallet, one Africa.</span>{" "}
            Pay in your local currency, support education excellence across the continent.
          </p>
        </div>
      </div>
    </section>
  );
}
