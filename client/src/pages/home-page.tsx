import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, DollarSign, Users, CheckCircle, Star } from "lucide-react";
import { ConferenceBanner } from "@/components/conference/conference-banner";
import { ConferenceHighlights } from "@/components/conference/conference-highlights";
import { IndustryMentorsCarousel } from "@/components/homepage/industry-mentors-carousel";
import { ImageCarousel } from "@/components/ui/image-carousel"; // Added ImageCarousel import

const stats = [
  { number: "1,000+", label: "Event Professionals" },
  { number: "5,000+", label: "Completed Events" },
  { number: "98%", label: "Client Satisfaction" },
  { number: "50+", label: "Event Categories" },
];

const howItWorks = [
  {
    title: "Create Your Profile",
    description: "Sign up and create your professional profile or client account",
    icon: Users,
  },
  {
    title: "Browse & Connect",
    description: "Find the perfect match for your event needs",
    icon: Calendar,
  },
  {
    title: "Secure Payment",
    description: "Pay securely through our platform",
    icon: DollarSign,
  },
];

const testimonials = [
  {
    quote: "Found amazing talent for my wedding within days!",
    author: "Sarah Johnson",
    role: "Event Planner",
    rating: 5,
  },
  {
    quote: "The platform helped me grow my business significantly.",
    author: "Mike Thompson",
    role: "Photographer",
    rating: 5,
  },
  {
    quote: "Seamless experience from start to finish.",
    author: "Emily Davis",
    role: "Corporate Event Manager",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        {/* Hero Section with Image Carousel */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="relative">
              <ImageCarousel 
                images={[
                  { src: "/images/hero-backgrounds/hero-bg1.jpg", alt: "Hero Background 1" },
                  { src: "/images/hero-backgrounds/hero-bg2.jpg", alt: "Hero Background 2" },
                  { src: "/images/hero-backgrounds/hero-bg3.jpg", alt: "Hero Background 3" },
                ]}
                autoPlayInterval={5000}
                fill={true}
                className="absolute inset-0 h-full w-full -z-10"
              />
              <div className="flex flex-col items-center space-y-8 text-center relative">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Find the Perfect Event Professional
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl text-justify">
                    Connect with talented event professionals or find your next event gig. 
                    Start exploring the marketplace today.
                  </p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-x-4"
                >
                  <Link href="/marketplace">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Browse Jobs <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button variant="outline" size="lg">
                      Start Hiring <Users className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center space-y-2"
                >
                  <span className="text-3xl font-bold text-blue-600">{stat.number}</span>
                  <span className="text-sm text-gray-500 text-center">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center space-y-4 text-center p-6 bg-white rounded-lg shadow-sm"
              >
                <Users className="h-12 w-12 text-blue-600" />
                <h3 className="text-2xl font-bold">For Event Professionals</h3>
                <p className="text-gray-500">Find new clients and grow your business with our platform</p>
                <CheckCircle className="h-6 w-6 text-green-500" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center space-y-4 text-center p-6 bg-white rounded-lg shadow-sm"
              >
                <Calendar className="h-12 w-12 text-blue-600" />
                <h3 className="text-2xl font-bold">For Event Planners</h3>
                <p className="text-gray-500">Hire talented professionals for your events with confidence</p>
                <CheckCircle className="h-6 w-6 text-green-500" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center space-y-4 text-center p-6 bg-white rounded-lg shadow-sm"
              >
                <DollarSign className="h-12 w-12 text-blue-600" />
                <h3 className="text-2xl font-bold">Secure Payments</h3>
                <p className="text-gray-500">Safe and secure payment processing for all transactions</p>
                <CheckCircle className="h-6 w-6 text-green-500" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Conference Banner Section */}
        <section className="w-full py-6 md:py-12 bg-white">
          <div className="container px-4 md:px-6">
            <ConferenceBanner 
              title="Atinuda 2025 Conference"
              date="May 15-17, 2025"
              location="Lagos International Convention Center"
              description="Delegate Participation Details and Registration Information Coming Soon. Check back later for updates!"
              email="info@atinuda2025.com"
              imagePath="/images/conference-banner.jpg"
            />
          </div>
        </section>
        
        {/* Conference Highlights */}
        <ConferenceHighlights />

        {/* Industry Mentors Carousel */}
        <IndustryMentorsCarousel />
        
        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="text-gray-500 mt-2">Simple steps to get started</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorks.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-gray-500">{step.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">What People Say</h2>
              <p className="text-gray-500 mt-2">Trusted by professionals and clients alike</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 bg-blue-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center text-white">
              <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
              <p className="max-w-[600px] text-blue-100">
                Join our community of event professionals and clients. Start your journey today.
              </p>
              <Link href="/auth">
                <Button size="lg" variant="secondary" className="mt-4">
                  Create Your Account <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-gray-900 text-gray-300">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">For Professionals</h3>
              <ul className="space-y-2">
                <li><Link href="/marketplace">Find Jobs</Link></li>
                <li><Link href="/profile">Create Profile</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Clients</h3>
              <ul className="space-y-2">
                <li><Link href="/marketplace">Post Jobs</Link></li>
                <li><Link href="/marketplace">Browse Professionals</Link></li>
                <li><Link href="/dashboard">Manage Events</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/blog">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/help">Help Center</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Event Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
