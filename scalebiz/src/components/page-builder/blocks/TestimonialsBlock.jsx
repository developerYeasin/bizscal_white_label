"use client";

import React from "react";
import { Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";

/**
 * Testimonials Block
 *
 * Displays customer testimonials in various layouts.
 *
 * Expected data:
 * - testimonials: array of { id, name, role, company, avatar?, content, rating }
 * - layout: grid | carousel | featured
 * - columns: number of columns for grid
 * - showAvatar: boolean
 * - showRating: boolean
 */
const TestimonialsBlock = ({ data }) => {
  const {
    testimonials = [],
    layout = "grid",
    columns = 2,
    showAvatar = true,
    showRating = true,
    className = "",
  } = data || {};

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className={`p-8 border-2 border-dashed rounded-lg text-center ${className}`}>
        <p className="text-muted-foreground text-sm">No testimonials added yet.</p>
      </div>
    );
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: "1.5rem",
  };

  const renderTestimonial = (testimonial) => (
    <div key={testimonial.id} className="flex flex-col p-6 bg-card border rounded-lg">
      <Quote className="h-8 w-8 text-primary/20 mb-4" />
      <p className="text-sm mb-4 flex-1">{testimonial.content}</p>
      <div className="flex items-start gap-3 mt-auto">
        {showAvatar && (
          <Avatar className="h-10 w-10">
            {testimonial.avatar ? (
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
            ) : (
              <AvatarFallback>{testimonial.name?.charAt(0) || "U"}</AvatarFallback>
            )}
          </Avatar>
        )}
        <div className="flex-1">
          <p className="font-medium text-sm">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">
            {testimonial.role}{testimonial.company && `, ${testimonial.company}`}
          </p>
          {showRating && testimonial.rating && renderStars(testimonial.rating)}
        </div>
      </div>
    </div>
  );

  if (layout === "featured" && testimonials.length > 0) {
    // Featured: highlight one testimonial
    const featured = testimonials[0];
    return (
      <div className={`testimonials-featured ${className}`}>
        <div className="max-w-2xl mx-auto text-center p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border">
          <Quote className="h-12 w-12 text-primary/20 mx-auto mb-4" />
          <p className="text-lg mb-6 italic">"{featured.content}"</p>
          <div className="flex items-center justify-center gap-3">
            {showAvatar && (
              <Avatar className="h-12 w-12">
                {featured.avatar ? (
                  <AvatarImage src={featured.avatar} alt={featured.name} />
                ) : (
                  <AvatarFallback>{featured.name?.charAt(0) || "U"}</AvatarFallback>
                )}
              </Avatar>
            )}
            <div className="text-left">
              <p className="font-semibold">{featured.name}</p>
              <p className="text-sm text-muted-foreground">
                {featured.role}{featured.company && `, ${featured.company}`}
              </p>
              {showRating && featured.rating && renderStars(featured.rating)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`testimonials-grid ${className}`} style={layout === "grid" ? gridStyle : undefined}>
      {testimonials.map(renderTestimonial)}
    </div>
  );
};

export default TestimonialsBlock;
