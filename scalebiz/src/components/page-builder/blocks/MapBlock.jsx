"use client";

import React from "react";
import { MapPin } from "lucide-react";

/**
 * Map Block
 *
 * Displays a Google Maps or OpenStreetMap embed.
 *
 * Expected data:
 * - provider: google | openstreetmap
 * - apiKey: Google Maps API key (if needed)
 * - center: { lat, lng }
 * - zoom: number (default 14)
 * - markers: array of { lat, lng, label?, info? }
 * - height: string (default "400px")
 * - style: default | satellite
 */
const MapBlock = ({ data }) => {
  const {
    provider = "openstreetmap",
    apiKey = "",
    center = { lat: 0, lng: 0 },
    zoom = 14,
    markers = [],
    height = "400px",
    style = "default",
    className = "",
  } = data || {};

  if (!center.lat || !center.lng) {
    return (
      <div className={`p-8 border-2 border-dashed rounded-lg text-center ${className}`}>
        <p className="text-muted-foreground text-sm">Set map location in settings.</p>
      </div>
    );
  }

  let mapUrl = "";

  if (provider === "google") {
    const mapType = style === "satellite" ? "satellite" : "roadmap";
    const markersParam = markers.length > 0
      ? `&markers=${markers.map(m => `${m.lat},${m.lng}`).join('&markers=')}`
      : "";
    mapUrl = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${center.lat},${center.lng}&zoom=${zoom}&maptype=${mapType}${markersParam}`;
  } else {
    // OpenStreetMap via iframe
    const mapUrlBase = "https://www.openstreetmap.org/export/embed.html";
    const markersParam = markers.length > 0
      ? `?mlat=${markers[0].lat}&mlon=${markers[0].lng}&zoom=${zoom}`
      : `?center=${center.lat},${center.lng}&zoom=${zoom}&layers=M`;
    mapUrl = mapUrlBase + markersParam;
  }

  return (
    <div className={`map-block ${className}`}>
      <div className="relative rounded-lg overflow-hidden border" style={{ height }}>
        <iframe
          src={mapUrl}
          title="Map"
          className="absolute top-0 left-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        {markers.length > 0 && (
          <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur px-3 py-2 rounded-md border text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{markers.length} location{markers.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapBlock;
