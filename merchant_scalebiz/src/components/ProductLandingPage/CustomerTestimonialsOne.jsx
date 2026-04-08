"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assuming Avatar component is available
import { useTranslation } from "react-i18next"; // Import useTranslation

const CustomerTestimonialsOne = ({ data }) => { // Accept data prop
  const { t } = useTranslation(); // Initialize useTranslation
  const { testimonials } = data; // Destructure testimonials from data prop

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
          {t('our_beloved_customer')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <p className="text-lg text-muted-foreground mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                    <AvatarFallback>{testimonial.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonialsOne;