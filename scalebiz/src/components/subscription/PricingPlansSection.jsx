"use client";

import React from "react";
import PricingPlanCard from "./PricingPlanCard.jsx";
import { useSubscriptionPlans } from "@/hooks/use-subscriptions.js"; // New import
import { Skeleton } from "@/components/ui/skeleton.jsx";

const PricingPlansSection = () => {
  const { data: plans, isLoading, error } = useSubscriptionPlans();

  if (isLoading) {
    return (
      <div className="mb-12 text-center">
        <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          Choose Your Plan
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Simple, Transparent <span className="text-purple-600">Pricing</span>
        </h1>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Choose the perfect plan for your business needs. All plans include our core features with premium support.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-[450px] w-full" />
          <Skeleton className="h-[450px] w-full" />
          <Skeleton className="h-[450px] w-full" />
          <Skeleton className="h-[450px] w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-12 text-center text-destructive">
        <h1 className="text-4xl font-bold mb-4">Error Loading Plans</h1>
        <p>Failed to load subscription plans: {error.message}</p>
      </div>
    );
  }

  return (
    <div id="pricing-plans" className="mb-12 text-center">
      <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
        Choose Your Plan
      </div>
      <h1 className="text-4xl font-bold mb-4">
        Simple, Transparent <span className="text-purple-600">Pricing</span>
      </h1>
      <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
        Choose the perfect plan for your business needs. All plans include our core features with premium support.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.length === 0 ? (
          <p className="col-span-full text-muted-foreground">No subscription plans available.</p>
        ) : (
          plans.map((plan) => (
            <PricingPlanCard
              key={plan.id}
              planName={plan.name}
              price={parseFloat(plan.price).toFixed(2)}
              currency="BDT" // Assuming BDT as currency
              oldPrice={plan.real_price ? parseFloat(plan.real_price).toFixed(2) : undefined}
              savePercentage={plan.real_price ? `${Math.round(((plan.real_price - parseFloat(plan.price)) / plan.real_price) * 100)}%` : undefined}
              features={plan.features}
              isRecommended={plan.adjective === "Recommended"}
              isMostPopular={plan.adjective === "Most Popular"}
              planId={plan.id} // Pass plan ID for subscription
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PricingPlansSection;