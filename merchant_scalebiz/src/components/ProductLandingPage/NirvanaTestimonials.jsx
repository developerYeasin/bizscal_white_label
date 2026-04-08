"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next"; // Import useTranslation

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

const NirvanaTestimonials = ({ data }) => { // Accept data prop
  const { t } = useTranslation(); // Initialize useTranslation
  const { title, testimonials } = data; // Destructure from data prop

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
          {title || t("testimonials")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="flex items-center mb-3 sm:mb-4">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 mr-3 sm:mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                    <AvatarFallback>{testimonial.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground text-base sm:text-lg">{testimonial.author}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mb-3 sm:mb-4">
                  {/* {renderStars(testimonial.rating)} */}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground italic">
                  "{testimonial.quote}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NirvanaTestimonials;