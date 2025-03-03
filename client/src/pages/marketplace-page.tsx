import { useQuery } from "@tanstack/react-query";
import { Job } from "@shared/schema";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, SlidersHorizontal, Search, MapPin, DollarSign, Briefcase, Calendar } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(10000);
  const [remoteOnly, setRemoteOnly] = useState(false);

  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  // Since we don't have a category field in the Job type,
  // we'll infer it from the job description or title for filtering
  const getJobCategory = (job: Job): string => {
    const title = job.title.toLowerCase();
    const description = job.description.toLowerCase();
    
    if (title.includes('wedding') || description.includes('wedding')) return 'wedding';
    if (title.includes('corporate') || description.includes('corporate')) return 'corporate';
    if (title.includes('party') || description.includes('party')) return 'party';
    if (title.includes('concert') || description.includes('concert')) return 'concert';
    return 'other';
  };

  const filteredJobs = jobs?.filter((job) => {
    if (search && !job.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (category !== "all" && getJobCategory(job) !== category) {
      return false;
    }
    if (job.budget < minBudget || job.budget > maxBudget) {
      return false;
    }
    if (remoteOnly && job.location.toLowerCase() !== "remote") {
      return false;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8"
      >
        <h1 className="text-3xl font-bold text-center mb-4">Find Your Perfect Event Job</h1>
        <p className="text-gray-600 text-center mb-6">Browse hundreds of opportunities for event professionals</p>
        
        <div className="flex flex-col md:flex-row justify-center gap-4 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Briefcase className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="wedding">Wedding</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="party">Party</SelectItem>
              <SelectItem value="concert">Concert</SelectItem>
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your job search with these filters.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-8">
                <div className="space-y-4">
                  <Label>Budget Range</Label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Min</Label>
                        <Input
                          type="number"
                          value={minBudget}
                          onChange={(e) => setMinBudget(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Max</Label>
                        <Input
                          type="number"
                          value={maxBudget}
                          onChange={(e) => setMaxBudget(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <Slider
                      value={[minBudget, maxBudget]}
                      max={10000}
                      step={100}
                      onValueChange={([min, max]) => {
                        setMinBudget(min);
                        setMaxBudget(max);
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="remote"
                    checked={remoteOnly}
                    onCheckedChange={setRemoteOnly}
                  />
                  <Label htmlFor="remote">Remote Only</Label>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.div>

      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Available Jobs</h2>
        <p className="text-sm text-gray-500">{filteredJobs?.length || 0} jobs found</p>
      </div>

      {filteredJobs?.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No jobs found</h3>
          <p className="text-gray-500">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs?.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <JobCard
                job={job}
                onApply={() => {
                  // Implement apply logic
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
      
      <div className="mt-16 bg-blue-600 text-white p-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Are you an event professional?</h2>
          <p className="mb-6">Create your profile and start finding great opportunities today.</p>
          <Button size="lg" variant="secondary">Create Your Profile</Button>
        </div>
      </div>
    </div>
  );
}
