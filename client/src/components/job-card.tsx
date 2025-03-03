import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Job } from "@shared/schema";
import { formatDistance } from "date-fns";
import { useState } from "react";
import { PaymentDialog } from "./payment-dialog";

interface JobCardProps {
  job: Job;
  onApply?: () => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  const [showPayment, setShowPayment] = useState(false);

  const handleApply = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    onApply?.();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{job.description}</p>
            <div className="flex justify-between text-sm">
              <span className="text-sm text-gray-500">Budget: ${job.budget}</span>
              <span className="text-sm text-gray-500">Location: {job.location}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Posted {formatDistance(new Date(job.createdAt || new Date()), new Date(), { addSuffix: true })}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleApply}>
            Apply Now
          </Button>
        </CardFooter>
      </Card>

      <PaymentDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        amount={job.budget}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}
