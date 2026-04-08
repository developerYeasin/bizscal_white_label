"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { CalendarCheck, Loader2 } from "lucide-react";
import { showInfo, showError, showSuccess } from "@/utils/toast.js";
import { useCurrentSubscription, useCancelSubscriptionMutation } from "@/hooks/use-subscriptions.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { format, isAfter } from "date-fns";
import { Link } from "react-router-dom"; // Import Link
import DeleteConfirmationDialog from "@/components/ui/DeleteConfirmationDialog.jsx"; // New import

const SubscriptionStatusCard = () => {
  const { data: currentSubscription, isLoading, error } = useCurrentSubscription();
  const { mutate: cancelSubscription, isPending: isCancelling } = useCancelSubscriptionMutation();

  const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false); // State for the custom dialog

  const handleAutoRenewal = () => {
    showInfo("Auto-renewal status updated (dummy action).");
  };

  const handleCancelSubscriptionClick = () => {
    setIsCancelDialogOpen(true); // Open the custom dialog
  };

  const handleConfirmCancelSubscription = () => {
    cancelSubscription(undefined, { // Pass undefined as payload for cancelSubscription
      onSuccess: () => {
        setIsCancelDialogOpen(false); // Close dialog on success
      },
      onError: () => {
        setIsCancelDialogOpen(false); // Close dialog on error
      }
    });
  };

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Subscription Status</CardTitle>
          <CalendarCheck className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-6 border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Subscription Status Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Failed to load subscription status: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const subscriptionActive = currentSubscription?.status === "completed";
  const endDate = currentSubscription?.end_date ? new Date(currentSubscription.end_date) : null;
  const daysLeft = endDate ? Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const isExpired = endDate ? isAfter(new Date(), endDate) : true;

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Subscription Status</CardTitle>
          <CalendarCheck className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {subscriptionActive && !isExpired ? (
            <>
              <h2 className="text-3xl font-bold mb-2">{daysLeft} days left</h2>
              <p className="text-sm text-muted-foreground mb-4">
                in your <span className="font-semibold">{currentSubscription.plan_name}</span> subscription
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white flex-1" onClick={handleAutoRenewal}>
                  Auto-renewal active
                  <span className="ml-2 text-xs">Next billing: {endDate ? format(endDate, "dd/MM/yyyy") : "N/A"}</span>
                </Button>
                <Button variant="outline" className="text-destructive hover:text-destructive flex-1" onClick={handleCancelSubscriptionClick} disabled={isCancelling}>
                  {isCancelling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Cancel Subscription"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-2 text-destructive">Inactive</h2>
              <p className="text-sm text-muted-foreground mb-4">Your subscription is currently inactive or expired.</p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full" asChild>
                <Link to="/subscribe-form">View Plans to Subscribe</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleConfirmCancelSubscription}
        title="Are you sure you want to cancel your subscription?"
        description="This action cannot be undone. Your subscription will remain active until the end of the current billing cycle, but will not auto-renew."
      />
    </>
  );
};

export default SubscriptionStatusCard;