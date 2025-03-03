import { motion } from "framer-motion";
import { Calendar, MapPin, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HighlightItem {
  title: string;
  description: string;
  imagePath: string;
  icon?: React.ReactNode;
  badges?: string[];
}

interface ConferenceHighlightsProps {
  items?: HighlightItem[];
}

export function ConferenceHighlights({ items }: ConferenceHighlightsProps) {
  const defaultItems: HighlightItem[] = [
    {
      title: "World-Class Speakers",
      description: "Learn from industry experts and thought leaders who will share insights on event management, marketing strategies, and emerging trends.",
      imagePath: "/images/speaker.jpg",
      icon: <Users className="h-5 w-5" />,
      badges: ["Industry Leaders", "Workshops", "Q&A Sessions"]
    },
    {
      title: "Premier Venue",
      description: "Our state-of-the-art conference center provides the perfect environment for learning, networking, and collaboration.",
      imagePath: "/images/venue.jpg",
      icon: <MapPin className="h-5 w-5" />,
      badges: ["Central Location", "Modern Facilities", "Exhibition Area"]
    }
  ];

  const displayItems = items || defaultItems;

  return (
    <div className="py-12 bg-slate-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Conference Highlights</h2>
          <p className="text-gray-500 max-w-2xl text-justify">Discover what makes Atinuda 2025 the must-attend event for event professionals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div 
                className="aspect-video w-full overflow-hidden"
                style={{
                  backgroundImage: `url(${item.imagePath})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '240px'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
              
              <div className="relative -mt-16 px-6 pt-0 pb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-blue-600 p-2 text-white">
                      {item.icon || <Star className="h-5 w-5" />}
                    </div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-justify">{item.description}</p>
                
                {item.badges && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.badges.map((badge, badgeIndex) => (
                      <Badge key={badgeIndex} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Registration will open soon. Be the first to secure your spot at this premier industry event.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Join Waitlist
          </Button>
        </div>
      </div>
    </div>
  );
}
