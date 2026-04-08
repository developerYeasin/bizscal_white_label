"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next"; // Import useTranslation

const ProductDescriptionTabs = ({ product, showDescription = true, showReviews = true }) => {
  const { t } = useTranslation(); // Initialize useTranslation
  // Placeholder for reviews - in a real app, this would come from product data
  const reviews = [
    {
      id: 1,
      author: "John Doe",
      rating: 5,
      date: "2023-01-15",
      comment: "Excellent product! Highly recommend it.",
    },
    {
      id: 2,
      author: "Jane Smith",
      rating: 4,
      date: "2023-02-20",
      comment: "Good quality, but shipping was a bit slow.",
    },
  ];

  const renderStars = (filledCount) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < filledCount
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          )}
        />
      );
    }
    return <div className="flex space-x-0.5">{stars}</div>;
  };

  // Extract content from product.details
  const productDetails = product.details || [];

  const desContent = productDetails.map((d) => {
    return {
      value: d.type,
      label: d.type,
      content: d.description,
    };
  });
  // console.log("desContent:", desContent);
  // Determine which tabs to show
  const tabsToShow = [...desContent].filter((tab) => tab.content); // Only show tabs if they have content or are the review tab
  // { value: "reviews", label: t('reviews'), content: null, isReviewTab: true },

  // If no dynamic content is available, ensure 'description' is the only tab
  if (
    tabsToShow.length === 1 &&
    tabsToShow[0].value === "reviews" &&
    !descriptionContent
  ) {
    // This case means only reviews tab is left, but no description.
    // This scenario should ideally not happen if product.description always exists.
    // For safety, we can default to showing just the main description.
    tabsToShow.unshift({
      value: "description",
      label: t("description"),
      content: product.description,
    });
  } else if (tabsToShow.length === 0 && product.description) {
    // If no tabs are left at all, but there's a main description, show it.
    tabsToShow.push({
      value: "description",
      label: t("description"),
      content: product.description,
    });
  }

  // Set default tab to 'description' or the first available tab
  const defaultTabValue =
    tabsToShow.length > 0 ? tabsToShow[0].value : "description";
    // console.log("defaultTabValue:", defaultTabValue);

  return (
    <Card className="shadow-sm border-none">
      <CardContent className="p-0">
        <Tabs defaultValue={defaultTabValue} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto rounded-none border-b border-border bg-transparent p-0">
            {tabsToShow.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none data-[state=active]:shadow-none data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-dynamic-primary-color"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="p-6">
            {tabsToShow.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {tab.value === "reviews" ? (
                  <>
                    <h3
                      className="text-xl font-semibold mb-4"
                      style={{ fontFamily: `var(--dynamic-heading-font)` }}
                    >
                      {t("customer_reviews")} ({reviews.length})
                    </h3>
                    {reviews.length === 0 ? (
                      <p className="text-muted-foreground">
                        {t("no_reviews_yet")}
                      </p>
                    ) : (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border-b pb-4 last:border-b-0 last:pb-0"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <p className="font-semibold text-foreground">
                                  {review.author}
                                </p>
                                <span className="text-sm text-muted-foreground">
                                  - {review.date}
                                </span>
                              </div>
                              {renderStars(review.rating)}
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {review.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: tab.content }}
                  />
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProductDescriptionTabs;
