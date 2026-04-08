"use client";

import React, { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ComponentResolver from "@/components/ComponentResolver"; // Import ComponentResolver

// Arcadia Static Design Components
const ProductHeroSectionOne = lazy(() => import("./ProductHeroSectionOne"));
const ProductBrandLogos = lazy(() => import("./ProductBrandLogos"));
const ProductShowcaseSection = lazy(() => import("./ProductShowcaseSection"));
const ProductFeatureBlocksOne = lazy(() => import("./ProductFeatureBlocksOne"));
const CustomerTestimonialsOne = lazy(() => import("./CustomerTestimonialsOne"));
const NewsletterSectionOne = lazy(() => import("./NewsletterSectionOne"));

const ArcadiaTemplate = ({ product, onBuyNowClick, nextProductId, prevProductId }) => {
  // Mock product data for showcase sections
  const showcaseProduct1 = {
    ...product,
    name: "The Nike GO FlyEase in white, Celestine Blue, and Volt",
    imageUrl: "https://elessi.b-cdn.net/elementor/wp-content/uploads/2020/05/5559315400_2_1_1-450x575.jpg",
    description: "Nike is planning on making the $120 sneaker available to everyone eventually, and says it will schedule another drop later this year. 'We know that this is a shoe that everybody wants, but has a huge impact as well,' says Sarah Reinertsen, a designer on the FlyEase Innovation team at Nike.",
    price: 120.00,
  };
  const showcaseProduct2 = {
    ...product,
    name: "The Nike GO FlyEase in black, turquoise, and crimson",
    imageUrl: "https://elessi.b-cdn.net/elementor/wp-content/uploads/2020/06/5713200620_2_1_11-450x575.jpg",
    description: "Nike is planning on making the $120 sneaker available to everyone eventually, and says it will schedule another drop later this year. 'We know that this is a shoe that everybody wants, but has a huge impact as well,' says Sarah Reinertsen, a designer on the FlyEase Innovation team at Nike.",
    price: 120.00,
  };
  const showcaseProduct3 = {
    ...product,
    name: "The Nike GO FlyEase in black, anthracite, and blue",
    imageUrl: "https://elessi.b-cdn.net/elementor/wp-content/uploads/2020/06/5713200620_2_1_1-450x575.jpg",
    description: "Nike is planning on making the $120 sneaker available to everyone eventually, and says it will schedule another drop later this year. 'We know that this is a shoe that everybody wants, but has a huge impact as well,' says Sarah Reinertsen, a designer on the FlyEase Innovation team at Nike.",
    price: 120.00,
  };

  const arcadiaShowcaseFeatures = [
    { title: "Comfort", description: "From walking to running, they provide comfort, function and style." },
    { title: "Stability", description: "With the right amount of stability and cushion, the FlyEase is perfect." },
    { title: "Hands-free", description: "FlyEase creates shoes that are quick and easy to get into more hands-free." },
  ];

  const arcadiaComponents = [
    { type: "productHeroSectionOne", data: {}, product: product, nextProductId: nextProductId, prevProductId: prevProductId },
    { type: "productBrandLogos", data: {} },
    {
      type: "productShowcaseSection",
      data: {
        title: "The Nike GO FlyEase in white, Celestine Blue, and Volt",
        description: showcaseProduct1.description,
        features: arcadiaShowcaseFeatures,
      },
      product: showcaseProduct1,
    },
    {
      type: "productShowcaseSection",
      data: {
        title: "The Nike GO FlyEase in black, turquoise, and crimson",
        description: showcaseProduct2.description,
        features: arcadiaShowcaseFeatures,
        reverseLayout: true,
      },
      product: showcaseProduct2,
    },
    {
      type: "productShowcaseSection",
      data: {
        title: "The Nike GO FlyEase in black, anthracite, and blue",
        description: showcaseProduct3.description,
        features: arcadiaShowcaseFeatures,
      },
      product: showcaseProduct3,
    },
    { type: "productFeatureBlocksOne", data: {} },
    { type: "customerTestimonialsOne", data: {} },
    { type: "newsletterSectionOne", data: {} },
  ].filter(component => component.product ? !!product : true); // Only include product-dependent components if product exists

  return (
    <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
      {arcadiaComponents.map((component, index) => (
        <ComponentResolver
          key={index}
          type={component.type}
          data={component.data}
          product={component.product || product} // Pass specific product if available, else general product
          onBuyNowClick={onBuyNowClick}
          nextProductId={component.nextProductId} // Pass next product ID
          prevProductId={component.prevProductId} // Pass previous product ID
        />
      ))}
    </Suspense>
  );
};

export default ArcadiaTemplate;