"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx"; // Import useAuth

interface UtilityBarProps {
  announcementText: string;
  showLanguageSelector: boolean;
  showCurrencySelector: boolean;
  showAuthLinks: boolean;
  enabled: boolean;
}

const UtilityBar: React.FC<UtilityBarProps> = ({
  announcementText,
  showLanguageSelector,
  showCurrencySelector,
  showAuthLinks,
  enabled,
}) => {
  if (!enabled) return null;

  const { isAuthenticated } = useAuth(); // Use isAuthenticated from AuthContext

  return (
    <div className="bg-gray-100 text-gray-700 text-sm py-2 px-4 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            {announcementText}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {showLanguageSelector && (
            <Select defaultValue="English">
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Bangla">Bangla</SelectItem>
              </SelectContent>
            </Select>
          )}
          {showCurrencySelector && (
            <Select defaultValue="USD">
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">US Dollar</SelectItem>
                <SelectItem value="BDT">BDT</SelectItem>
              </SelectContent>
            </Select>
          )}
          {showAuthLinks && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {isAuthenticated ? (
                <Link to="/profile" className="hover:underline">
                  My Account
                </Link>
              ) : (
                <>
                  <Link to="/login" className="hover:underline">
                    Login
                  </Link>
                  <Separator orientation="vertical" className="h-4" />
                  <Link to="/register" className="hover:underline">
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UtilityBar;