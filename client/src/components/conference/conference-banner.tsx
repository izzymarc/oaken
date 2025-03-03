import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, Info, MapPin, Users } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface ConferenceDetails {
  title: string;
  date?: string;
  location?: string;
  description: string;
  email: string;
  imagePath: string;
  backgroundPosition?: string;
}

export function ConferenceBanner({
  title = "Atinuda 2025 Conference",
  date,
  location,
  description = "Delegate Participation Details and Registration Information Coming Soon. Check back later for updates!",
  email = "info@atinuda2025.com",
  imagePath = "/images/conference-banner.jpg",
  backgroundPosition = "center",
}: ConferenceDetails) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full overflow-hidden rounded-xl shadow-xl"
      style={{ 
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3)), url(${imagePath})`,
        backgroundSize: 'cover',
        backgroundPosition,
        height: '400px'
      }}
    >
      <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {title}
          </h2>
          <div className="h-1 w-32 bg-blue-600 mb-6"></div>
          
          <div className="mb-8 max-w-2xl text-lg text-white/85">
            <p>{description}</p>
          </div>
          
          <div className="space-y-3 md:space-y-0 md:flex md:space-x-4 mb-8">
            {date && (
              <div className="flex items-center text-white">
                <Calendar className="mr-2 h-5 w-5 text-blue-400" />
                <span>{date}</span>
              </div>
            )}
            
            {location && (
              <div className="flex items-center text-white">
                <MapPin className="mr-2 h-5 w-5 text-blue-400" />
                <span>{location}</span>
              </div>
            )}
            
            <div className="flex items-center text-white">
              <Info className="mr-2 h-5 w-5 text-blue-400" />
              <span>Contact: {email}</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Learn More
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{title}</DialogTitle>
                  <DialogDescription className="text-justify">
                    More information about the upcoming conference
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <h3 className="font-medium">About the Conference</h3>
                    <p className="text-sm text-gray-500">
                      Join us for the premier event in the event planning industry. Network with industry leaders,
                      learn from expert speakers, and explore new opportunities.
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <h3 className="font-medium">What to Expect</h3>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li className="flex items-start">
                        <Users className="mr-2 h-4 w-4 text-blue-500 mt-0.5" />
                        <span>Networking opportunities with industry professionals</span>
                      </li>
                      <li className="flex items-start">
                        <Calendar className="mr-2 h-4 w-4 text-blue-500 mt-0.5" />
                        <span>Insightful workshops and seminars</span>
                      </li>
                      <li className="flex items-start">
                        <MapPin className="mr-2 h-4 w-4 text-blue-500 mt-0.5" />
                        <span>Exhibition showcasing the latest in event technology</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="text-sm">
                    Delegate registration details will be available soon. For inquiries, please contact us at {email}.
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/20 hover:text-white">
              <a href={`mailto:${email}`}>Contact Us</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
