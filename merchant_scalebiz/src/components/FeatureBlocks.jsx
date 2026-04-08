import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, RefreshCcw, ShieldCheck } from "lucide-react"; // Example icons
import { cn } from "@/lib/utils";

const iconMap = {
  truck: Truck,
  refresh: RefreshCcw,
  shield: ShieldCheck,
  // Add more mappings as needed
};

const FeatureBlocks = ({ data, className }) => {
  const { features } = data;

  if (!features || features.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-8 md:py-12 bg-background", className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Truck; // Default icon
            return (
              <Card key={index} className="text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <div className="mb-4 p-3 rounded-full bg-dynamic-primary-color text-dynamic-secondary-color">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureBlocks;