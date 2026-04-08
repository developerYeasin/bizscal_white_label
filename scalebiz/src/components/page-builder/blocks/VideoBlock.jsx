"use client";

import React from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

/**
 * Video Block
 *
 * Embeds a video from URL or file.
 *
 * Expected data:
 * - videoUrl: string (YouTube, Vimeo, or direct mp4)
 * - type: youtube | vimeo | mp4
 * - autoplay: boolean
 * - controls: boolean
 * - muted: boolean
 * - poster: optional image URL
 * - aspectRatio: 16:9 | 4:3 | 1:1
 */
const VideoBlock = ({ data }) => {
  const {
    videoUrl = "",
    type = "youtube",
    autoplay = false,
    controls = true,
    muted = false,
    poster = "",
    aspectRatio = "16:9",
    className = "",
  } = data || {};

  const getEmbedUrl = () => {
    if (!videoUrl) return null;

    if (type === "youtube") {
      const videoId = extractYouTubeId(videoUrl);
      if (!videoId) return null;
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&controls=${controls ? 1 : 0}&mute=${muted ? 1 : 0}`;
    }

    if (type === "vimeo") {
      const videoId = extractVimeoId(videoUrl);
      if (!videoId) return null;
      return `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}&controls=${controls ? 1 : 0}&muted=${muted ? 1 : 0}`;
    }

    return videoUrl; // direct mp4
  };

  const extractYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const extractVimeoId = (url) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  };

  const aspectRatios = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
  };

  const aspectClass = aspectRatios[aspectRatio] || "aspect-video";

  const embedUrl = getEmbedUrl();

  if (!videoUrl) {
    return (
      <div className={`p-8 border-2 border-dashed rounded-lg text-center ${className}`}>
        <p className="text-muted-foreground text-sm">Add a video URL in settings.</p>
      </div>
    );
  }

  if (type === "mp4") {
    return (
      <div className={`video-block ${className}`}>
        <video
          src={videoUrl}
          poster={poster}
          controls={controls}
          autoPlay={autoplay}
          muted={muted}
          className={`w-full ${aspectClass} rounded-lg bg-black`}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className={`video-block ${className}`}>
      <div className={`relative w-full ${aspectClass} bg-black rounded-lg overflow-hidden`}>
        <iframe
          src={embedUrl}
          title="Video"
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoBlock;
