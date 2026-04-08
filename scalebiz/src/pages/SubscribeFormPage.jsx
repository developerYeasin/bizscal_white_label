"use client";

import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.jsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { useSubscribeMutation, useVerifyPaymentMutation, useSubscriptionPlans } from "@/hooks/use-subscriptions.js";
import { showSuccess, showError, showInfo } from "@/utils/toast.js";
import { Loader2, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { cn } from "@/lib/utils.js"; // Import cn utility

const paymentMethods = [
  { name: "Bkash", value: "Bkash", logo: "https://res.cloudinary.com/dfsqtffsg/image/upload/v1759609342/qylohm25p27qyhzsyaxv.png" },
  { name: "Rocket", value: "Rocket", logo: "https://res.cloudinary.com/dfsqtffsg/image/upload/v1759609301/tocbg9orc7qkbyunwvbu.png" },
  { name: "Nagad", value: "Nagad", logo: "https://res.cloudinary.com/dfsqtffsg/image/upload/v1759609390/mvsxxoqd6wina7bxyvmk.png" },
  { name: "Stripe", value: "Stripe", logo: "https://res.cloudinary.com/dfsqtffsg/image/upload/v1759609430/ykgibvi36vra7kujpieu.png" },
  { name: "SSL_Commerz", value: "SSL_Commerz", logo: "https://res.cloudinary.com/dfsqtffsg/image/upload/v1759609443/y6zjnwf2fcqylbnouihf.png" },
];

const SubscribeFormPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPlanId = searchParams.get('planId');

  const { data: plans, isLoading: isLoadingPlans, error: plansError } = useSubscriptionPlans();
  const { mutate: subscribe, isPending: isSubscribing } = useSubscribeMutation();
  const { mutate: verify, isPending: isVerifying } = useVerifyPaymentMutation();

  const [selectedPlanId, setSelectedPlanId] = React.useState(initialPlanId || "");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState("");
  const [promoCode, setPromoCode] = React.useState("");
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);
  const [transactionDetails, setTransactionDetails] = React.useState(null);
  const [isApplyingPromo, setIsApplyingPromo] = React.useState(false);

  React.useEffect(() => {
    if (plans && initialPlanId && !selectedPlanId) {
      const planExists = plans.some(p => String(p.id) === initialPlanId);
      if (planExists) {
        setSelectedPlanId(initialPlanId);
      } else {
        showError("Selected plan not found.");
        setSelectedPlanId(""); // Clear invalid selection
      }
    }
  }, [plans, initialPlanId, selectedPlanId]);

  const selectedPlan = React.useMemo(() => {
    return plans?.find(p => String(p.id) === selectedPlanId);
  }, [plans, selectedPlanId]);

  const handlePayNow = () => {
    if (!selectedPlan) {
      showError("Please select a subscription plan.");
      return;
    }
    if (!selectedPaymentMethod) {
      showError("Please select a payment method.");
      return;
    }
    if (!agreedToTerms) {
      showError("Please agree to the terms and conditions.");
      return;
    }

    const payload = {
      subscription_id: selectedPlan.id,
      payment_method: selectedPaymentMethod,
      promo_code: promoCode || undefined,
    };

    subscribe(payload, {
      onSuccess: (data) => {
        setTransactionDetails(data);
      },
    });
  };

  const handleVerifyPayment = () => {
    if (!transactionDetails?.transaction_id) {
      showError("No transaction ID available to verify.");
      return;
    }

    const payload = {
      transaction_id: transactionDetails.transaction_id,
      status: "completed",
    };

    verify(payload, {
      onSuccess: () => {
        navigate("/subscription"); // Go back to subscription status page
      },
    });
  };

  const handleApplyPromo = () => {
    setIsApplyingPromo(true);
    setTimeout(() => {
      setIsApplyingPromo(false);
      if (promoCode === "FALL25") {
        showSuccess("Promo code applied successfully!");
      } else {
        showError("Invalid promo code.");
      }
    }, 1000);
  };

  const isLoading = isLoadingPlans || isSubscribing || isVerifying;

  if (isLoadingPlans) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-80 w-full max-w-md" />
      </div>
    );
  }

  if (plansError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-destructive">
        <p>Error loading subscription plans: {plansError.message}</p>
        <Button onClick={() => navigate("/subscription")} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Subscription
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md my-8 mx-auto">
        <CardHeader className="text-center">
          <Button variant="ghost" size="icon" onClick={() => navigate("/subscription")} className="absolute top-4 left-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-2xl font-bold">Complete Your Subscription</CardTitle>
          <CardDescription>Select a plan and choose your payment method.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-6 py-4">
              {/* Plan Selection */}
              <div>
                <Label htmlFor="plan-select">Select Plan</Label>
                <Select value={selectedPlanId} onValueChange={setSelectedPlanId} disabled={isLoading || transactionDetails}>
                  <SelectTrigger id="plan-select" className="mt-1">
                    <SelectValue placeholder="Choose a subscription plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map(plan => (
                      <SelectItem key={plan.id} value={String(plan.id)}>
                        {plan.name} (BDT {parseFloat(plan.price).toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPlan && (
                <div className="border rounded-md p-4 bg-muted/50">
                  <p className="text-sm">Subscription plan: <span className="font-semibold">{selectedPlan.name}</span></p>
                  <p className="text-sm">Subscription amount: <span className="font-semibold">BDT {parseFloat(selectedPlan.price).toFixed(2)}</span></p>
                  <p className="text-sm">Transaction fee: <span className="font-semibold">BDT 10.00</span></p>
                  <p className="text-lg font-bold mt-2">Total amount: BDT {parseFloat(selectedPlan.price) + 10.00}</p>
                </div>
              )}

              <div>
                <Label htmlFor="promoCode">Apply Promo Code</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="promoCode"
                    placeholder="Ex: ZATIQ31"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={isLoading || isApplyingPromo || transactionDetails}
                  />
                  <Button onClick={handleApplyPromo} disabled={isLoading || isApplyingPromo || transactionDetails}>
                    {isApplyingPromo ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                  </Button>
                </div>
              </div>

              {!transactionDetails ? (
                <>
                  <div>
                    <Label>Payment Method</Label>
                    <RadioGroup
                      value={selectedPaymentMethod}
                      onValueChange={setSelectedPaymentMethod}
                      className="grid grid-cols-2 gap-4 mt-2"
                      disabled={isLoading || !selectedPlan}
                    >
                      {paymentMethods.map((method) => (
                        <div
                          key={method.value}
                          className={cn(
                            "flex items-center space-x-2 border rounded-md p-3 cursor-pointer transition-all duration-200",
                            selectedPaymentMethod === method.value
                              ? "bg-purple-100 border-purple-600"
                              : "border-border hover:border-purple-300"
                          )}
                          onClick={() => setSelectedPaymentMethod(method.value)}
                        >
                          <RadioGroupItem value={method.value} id={method.value} />
                          <Label htmlFor={method.value} className="flex items-center gap-2 cursor-pointer flex-1">
                            <img src={method.logo} alt={method.name} className="h-6 object-contain" />
                            <span className="sr-only">{method.name}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={setAgreedToTerms}
                      disabled={isLoading || !selectedPlan}
                    />
                    <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      I agree to the <a href="#" className="text-blue-500 hover:underline">Terms and Conditions</a>, <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a> and <a href="#" className="text-blue-500 hover:underline">Refund Policy</a>
                    </Label>
                  </div>
                </>
              ) : (
                <div className="border rounded-md p-4 bg-blue-50/50 text-blue-800">
                  <p className="font-semibold mb-2">Payment Instructions:</p>
                  <p className="text-sm">{transactionDetails.payment_details}</p>
                  {transactionDetails.transaction_id && (
                    <p className="text-sm mt-2"><strong>Transaction ID:</strong> {transactionDetails.transaction_id}</p>
                  )}
                </div>
              )}
            </div>
          <div className="flex justify-end gap-2 mt-4 border-t pt-4">
            <Button variant="outline" onClick={() => navigate("/subscription")} disabled={isLoading}>Cancel</Button>
            {!transactionDetails ? (
              <Button onClick={handlePayNow} disabled={isLoading || !agreedToTerms || !selectedPaymentMethod || !selectedPlan}>
                {isSubscribing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Pay Now"}
              </Button>
            ) : (
              <Button onClick={handleVerifyPayment} disabled={isLoading}>
                {isVerifying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Verify Payment"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscribeFormPage;