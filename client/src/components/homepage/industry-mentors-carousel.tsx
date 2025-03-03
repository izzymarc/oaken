import { ImageCarousel } from "@/components/ui/image-carousel";

const mentorImages = [
  {
    src: "/images/carousel/event1.jpg",
    alt: "Event Mentor 1",
    title: "Expert Guidance for Event Professionals",
    subtitle: "Connect with seasoned mentors in the event industry to elevate your career and business.",
    badge: "Mentorship Program",
    link: "/mentorship"
  },
  {
    src: "/images/carousel/event2.jpg",
    alt: "Event Mentor 2",
    title: "Unlock Your Potential with Industry Leaders",
    subtitle: "Learn from the best, gain invaluable insights, and take your event planning skills to the next level.",
    badge: "Career Development",
    link: "/mentorship"
  },
  {
    src: "/images/carousel/event3.jpg",
    alt: "Event Mentor 3",
    title: "Transform Your Event Career Today",
    subtitle: "Our mentors provide personalized advice and support to help you achieve your professional goals.",
    badge: "Personalized Coaching",
    link: "/mentorship"
  },
];

export function IndustryMentorsCarousel() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Industry Mentors</h2>
          <p className="text-gray-500 mt-2 text-justify">Learn from the best in the event industry</p>
        </div>
        <ImageCarousel images={mentorImages} aspectRatio="wide" fill={false} autoPlayInterval={4000} />
      </div>
    </section>
  );
}
