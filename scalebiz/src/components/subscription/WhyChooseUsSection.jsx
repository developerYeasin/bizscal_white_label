"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Shield, Zap, Headphones } from "lucide-react";

const WhyChooseUsSection = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security. 99.9% uptime guaranteed.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get your store online in minutes, not hours.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our dedicated support team is here to help you succeed, anytime you need.",
    },
  ];

  return (
    <div className="mb-12 text-center">
      <h2 className="text-3xl font-bold mb-8">Why Choose Our Platform?</h2>
      <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
        Join thousands of satisfied merchants who trust our platform for their business growth
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <Card key={index} className="p-6 flex flex-col items-center text-center">
            <div className="bg-purple-100 p-3 rounded-full mb-4">
              <benefit.icon className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle className="text-xl font-semibold mb-2">{benefit.title}</CardTitle>
            <CardContent className="p-0 text-sm text-muted-foreground">
              {benefit.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUsSection;