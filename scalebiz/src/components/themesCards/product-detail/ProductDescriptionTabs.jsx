"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const ProductDescriptionTabs = ({ product }) => {
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
            i < filledCount ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          )}
        />
      );
    }
    return <div className="flex space-x-0.5">{stars}</div>;
  };

  return (
    <Card className="shadow-sm border-none">
      <CardContent className="p-0">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger value="description" className="rounded-none data-[state=active]:shadow-none data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-dynamic-primary-color">Description</TabsTrigger>
            <TabsTrigger value="product-details" className="rounded-none data-[state=active]:shadow-none data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-dynamic-primary-color">Product Details</TabsTrigger>
            <TabsTrigger value="tab-title" className="rounded-none data-[state=active]:shadow-none data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-dynamic-primary-color">Tab Title</TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none data-[state=active]:shadow-none data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-dynamic-primary-color">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>
          <div className="p-6">
            <TabsContent value="description">
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: `var(--dynamic-heading-font)` }}>Product Description</h3>
                <p>{product.description}</p>
                <p>
                  Combining a blended linen construction with tailored style, the River Island HR Jasper Blazer will imprint a touch of dapper charm into your after-dark wardrobe. Our model is wearing a size medium blazer, and usually takes a size medium/38L shirt. He is 6’2” (188cm) tall with a 38” (97cm) chest and a 31” (79cm) waist.
                </p>
                <ul className="list-disc list-inside space-y-1 mt-4">
                  <li>Length: 74cm</li>
                  <li>Regular fit</li>
                  <li>Two button front fastening</li>
                  <li>Chest pocket</li>
                  <li>Twin front button fastening</li>
                  <li>Internal pockets</li>
                  <li>Centre-back vent</li>
                  <li>Dry clean only.</li>
                  <li>Material Outer: 50% Linen & 50% Polyamide; Body Lining: 100% Cotton; Lining: 100% Acetate</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="product-details">
              <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: `var(--dynamic-heading-font)` }}>Additional Product Information</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>Weight:</strong> 0.5 kg</li>
                <li><strong>Dimensions:</strong> 20 x 15 x 5 cm</li>
                <li><strong>Materials:</strong> Cotton, Polyester</li>
                <li><strong>Care Instructions:</strong> Machine wash cold, tumble dry low.</li>
              </ul>
            </TabsContent>
            <TabsContent value="tab-title">
              <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: `var(--dynamic-heading-font)` }}>Custom Tab Content</h3>
              <p className="text-muted-foreground">
                This is a custom tab that can be used for any additional information you want to provide, such as sizing charts, brand stories, or special instructions.
              </p>
            </TabsContent>
            <TabsContent value="reviews">
              <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: `var(--dynamic-heading-font)` }}>Customer Reviews ({reviews.length})</h3>
              {reviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-foreground">{review.author}</p>
                          <span className="text-sm text-muted-foreground">- {review.date}</span>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-muted-foreground text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProductDescriptionTabs;