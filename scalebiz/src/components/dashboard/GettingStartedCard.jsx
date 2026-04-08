"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react"; // Using CheckCircle2 for the green checkmark

const GettingStartedCard = ({ icon: Icon, title, description, buttonText, buttonLink, isCompleted = false, onActionClick }) => {
  return (
    <Card className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          {isCompleted ? (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          ) : (
            <Icon className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {buttonLink ? (
        <Button asChild variant={isCompleted ? "outline" : "default"} className={isCompleted ? "" : "bg-purple-600 hover:bg-purple-700 text-white"}>
          <Link to={buttonLink}>
            {buttonText}
          </Link>
        </Button>
      ) : (
        <Button variant={isCompleted ? "outline" : "default"} className={isCompleted ? "" : "bg-purple-600 hover:bg-purple-700 text-white"} onClick={onActionClick}>
          {buttonText}
        </Button>
      )}
    </Card>
  );
};

export default GettingStartedCard;