"use client";

import React, { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ComponentResolver from "@/components/ComponentResolver"; // Import ComponentResolver

// Nirvana Static Design Components
const NirvanaHeroSection = lazy(() => import("./NirvanaHeroSection"));
const NirvanaWhyChooseUs = lazy(() => import("./NirvanaWhyChooseUs"));
const NirvanaAboutUs = lazy(() => import("./NirvanaAboutUs"));
const NirvanaProductShowcase = lazy(() => import("./NirvanaProductShowcase"));
const NirvanaWhyWeAreBest = lazy(() => import("./NirvanaWhyWeAreBest"));
const NirvanaTestimonials = lazy(() => import("./NirvanaTestimonials"));
const NirvanaNewsletter = lazy(() => import("./NirvanaNewsletter"));

const NirvanaTemplate = ({ product, onBuyNowClick, nextProductId, prevProductId }) => {
  // Mock product data for Nirvana showcases (can be refined if product has more specific data)
  const nirvanaProduct1 = {
    ...product,
    imageUrl: "https://elessi.b-cdn.net/elementor/wp-content/uploads/2016/06/product-01-01.jpg",
  };
  const nirvanaProduct2 = {
    ...product,
    imageUrl: "https://elessi.b-cdn.net/elementor/wp-content/uploads/2016/06/product-01-02.jpg",
  };
  const nirvanaProduct3 = {
    ...product,
    imageUrl: "https://elessi.b-cdn.net/elementor/wp-content/uploads/2016/06/product-01-03.jpg",
  };

  const nirvanaComponents = [
    { type: "nirvanaHeroSection", data: {}, product: product, nextProductId: nextProductId, prevProductId: prevProductId },
    { type: "nirvanaWhyChooseUs", data: {} },
    { type: "nirvanaAboutUs", data: {} },
    {
      type: "nirvanaProductShowcase",
      data: {
        title: "Alfred Dunhill",
        description: "Alfred Dunhill is a British design house specializing in men's clothing, luxury goods and accessories. The business began when Alfred Dunhill,.",
      },
      product: nirvanaProduct1,
    },
    {
      type: "nirvanaProductShowcase",
      data: {
        title: "Givenchy Pi Aftershave",
        description: "To hydrate the skin and enhance your fragrance ritual, apply the Pi After-Shave Balm to freshly shaven skin, using a gentle, patting motion.",
        reverseLayout: true,
      },
      product: nirvanaProduct2,
    },
    {
      type: "nirvanaProductShowcase",
      data: {
        title: "Floral Decadence",
        description: "Fudge-like and deliciously sweet, this long-lasting and indulgent scent leaves you wanting more. Spritz yourself with this simple, warm and sophisticated scent.",
      },
      product: nirvanaProduct3,
    },
    { type: "nirvanaWhyWeAreBest", data: {} },
    { type: "nirvanaTestimonials", data: {} },
    { type: "nirvanaNewsletter", data: {} },
  ].filter(component => component.product ? !!product : true); // Only include product-dependent components if product exists

  return (
    <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
      {nirvanaComponents.map((component, index) => (
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

export default NirvanaTemplate;