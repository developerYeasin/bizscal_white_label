"use client";

import { useParams } from "react-router-dom";
import { useCallback } from "react";

export function useStorePath() {
  const { storeId } = useParams();

  const getPath = useCallback((path) => {
    if (storeId) {
      // Ensure path doesn't start with / to avoid // when prepending
      const cleanPath = path.startsWith('/') ? path.substring(1) : path;
      return `/merchant/${storeId}/${cleanPath}`;
    }
    return path;
  }, [storeId]);

  return getPath;
}