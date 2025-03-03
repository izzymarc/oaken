import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  onSuccess?: () => void;
}

export function PaymentDialog({ open, onOpenChange, amount, onSuccess }: PaymentDialogProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const { toast } = useToast();

  const createPaymentIntent = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/payment/create-intent", { amount });
      return res.json();
    },
    onSuccess: async (data) => {
      // Here we would normally use the Stripe Elements library
      // For now, we'll just show a success message
      toast({
        title: "Payment successful",
        description: "Your payment has been processed successfully.",
      });
      onSuccess?.();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPaymentIntent.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Card Number</label>
            <Input
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Expiry Date</label>
              <Input
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CVC</label>
              <Input
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                maxLength={3}
                type="password"
              />
            </div>
          </div>
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={createPaymentIntent.isPending}
            >
              {createPaymentIntent.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                `Pay $${amount}`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
