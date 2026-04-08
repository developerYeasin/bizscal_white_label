"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { PlayCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";

const FeaturedVideoSection = ({ config, updateNested, isUpdating }) => { // Accept config, updateNested, isUpdating as props
  const maxLength = 100;

  const handleUpdateField = (field, value) => {
    console.log(`FeaturedVideoSection: Updating field: ${field}, value: ${value}`);
    updateNested(field, value);
  };

  if (!config) { // Check for config prop
    return (
      <CollapsibleCard title="Featured video">
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </CollapsibleCard>
    );
  }

  return (
    <CollapsibleCard title="Featured video">
      <p className="text-sm text-muted-foreground mb-4">
        You can add a featured video describing your product using youtube link
      </p>
      <div className="mb-4">
        <Label htmlFor="videoTitle">Title</Label>
        <Input
          id="videoTitle"
          placeholder="Title"
          className="mt-1"
          value={config.featured_video_title || ''}
          onChange={(e) => handleUpdateField('featured_video_title', e.target.value)}
          maxLength={maxLength}
          disabled={isUpdating}
        />
        <p className="text-xs text-muted-foreground text-right mt-1">
          Character limit: {maxLength - (config.featured_video_title || '').length}/{maxLength}
        </p>
      </div>
      <div className="relative border-2 border-dashed border-gray-300 rounded-md p-6 text-center flex flex-col items-center justify-center h-48">
        {config.featured_video_url ? (
          <iframe
            src={`https://www.youtube.com/embed/${config.featured_video_url.split('v=')[1]?.split('&')[0]}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full object-cover rounded-md absolute inset-0"
            title="Featured Video"
          ></iframe>
        ) : (
          <img src="https://picsum.photos/seed/featured-video/300/150" alt="Video Placeholder" className="h-full w-full object-cover rounded-md absolute inset-0 opacity-50" />
        )}
        <PlayCircle className="h-12 w-12 text-muted-foreground mb-2 relative z-10" />
        <Input
          placeholder="Product Video Link (YouTube URL)"
          className="mt-1 relative z-10 w-full max-w-sm"
          value={config.featured_video_url || ''}
          onChange={(e) => handleUpdateField('featured_video_url', e.target.value)}
          disabled={isUpdating}
        />
      </div>
    </CollapsibleCard>
  );
};

export default FeaturedVideoSection;