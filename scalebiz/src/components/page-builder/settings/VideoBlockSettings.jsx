"use client";

import React, { useCallback } from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

/**
 * Video Block Settings
 *
 * Configure video source, type, and playback options.
 */
const VideoBlockSettings = ({ component, updateNested, isUpdating }) => {
  const { data } = component;

  const handleChange = useCallback((field, value) => {
    updateNested(`data.${field}`, value);
  }, [updateNested]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs">Video Type</Label>
        <Select
          value={data.type || "youtube"}
          onValueChange={(val) => handleChange("type", val)}
          disabled={isUpdating}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="vimeo">Vimeo</SelectItem>
            <SelectItem value="mp4">MP4 File</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {data.type !== "mp4" ? (
        <div className="space-y-2">
          <Label className="text-xs">Video URL</Label>
          <Input
            value={data.videoUrl || ""}
            onChange={(e) => handleChange("videoUrl", e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="h-8"
            disabled={isUpdating}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label className="text-xs">MP4 File</Label>
          <div className="flex gap-2">
            <Input
              value={data.videoUrl || ""}
              onChange={(e) => handleChange("videoUrl", e.target.value)}
              placeholder="https://.../video.mp4"
              className="h-8"
              disabled={isUpdating}
            />
            <input
              type="file"
              accept="video/mp4"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  handleChange("videoUrl", url);
                }
              }}
              style={{ display: "none" }}
              disabled={isUpdating}
              id="video-upload"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => document.getElementById("video-upload")?.click()}
              disabled={isUpdating}
            >
              <Upload className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-xs">Aspect Ratio</Label>
        <Select
          value={data.aspectRatio || "16:9"}
          onValueChange={(val) => handleChange("aspectRatio", val)}
          disabled={isUpdating}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
            <SelectItem value="4:3">4:3 (Standard)</SelectItem>
            <SelectItem value="1:1">1:1 (Square)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-xs">Playback</Label>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoplay"
              checked={data.autoplay || false}
              onChange={(e) => handleChange("autoplay", e.target.checked)}
              disabled={isUpdating}
              className="h-4 w-4"
            />
            <Label htmlFor="autoplay" className="text-xs">Autoplay</Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="controls"
              checked={data.controls !== false}
              onChange={(e) => handleChange("controls", e.target.checked)}
              disabled={isUpdating}
              className="h-4 w-4"
            />
            <Label htmlFor="controls" className="text-xs">Controls</Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="muted"
              checked={data.muted || false}
              onChange={(e) => handleChange("muted", e.target.checked)}
              disabled={isUpdating}
              className="h-4 w-4"
            />
            <Label htmlFor="muted" className="text-xs">Muted</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoBlockSettings;
