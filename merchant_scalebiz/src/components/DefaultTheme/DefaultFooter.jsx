import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, X, MapPin, Phone, Mail as MailIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { useStorePath } from "@/hooks/use-store-path"; // Import useStorePath

const SocialIcon = ({ platform, url }) => {
  let IconComponent;
  switch (platform) {
    case "facebook": IconComponent = Facebook; break;
    case "instagram": IconComponent = Instagram; break;
    case "twitter": IconComponent = X; break;
    case "youtube": IconComponent = Youtube; break;
    case "mail": IconComponent = Mail; break;
    default: return null;
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-dynamic-primary-color transition-colors">
      <IconComponent className="h-6 w-6" />
    </a>
  );
};

const DefaultFooter = ({ layout, copyrightText, socialLinks, logoUrl, storeName }) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const layoutStyle = layout?.layoutStyle || "multi-column";
  const columns = layout?.columns || [];
  const getPath = useStorePath(); // Initialize useStorePath

  return (
    <footer className="bg-background text-foreground py-8 px-6 border-t border-border">
      <div className="container mx-auto">
        {layoutStyle === "multi-column" && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
            {columns.map((column, colIndex) => (
              <div key={colIndex}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: `var(--dynamic-primary-color)` }}>{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link to={getPath(link.path)} className="text-foreground hover:text-dynamic-primary-color transition-colors text-sm">
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {layoutStyle === "contact-and-links" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col space-y-4">
              {logoUrl && (
                <Link to={getPath("/")} className="flex items-center mb-4">
                  <img src={logoUrl} alt={storeName} className="h-10" />
                </Link>
              )}
              {layout.contactInfo && (
                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{layout.contactInfo.address}</span>
                  </p>
                  <p className="flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    <span>{layout.contactInfo.phone}</span>
                  </p>
                  <p className="flex items-center">
                    <MailIcon className="h-5 w-5 mr-2" />
                    <span>{layout.contactInfo.email}</span>
                  </p>
                </div>
              )}
              <div className="flex space-x-4 mt-4">
                {socialLinks.map((link, index) => (
                  <SocialIcon key={index} platform={link.platform} url={link.url} />
                ))}
              </div>
            </div>

            {columns.map((column, colIndex) => (
              <div key={colIndex}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: `var(--dynamic-primary-color)` }}>{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link to={getPath(link.path)} className="text-foreground hover:text-dynamic-primary-color transition-colors text-sm">
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0 ">{copyrightText}</p>
          {layoutStyle !== "detailed-info" && (
            <div className="flex space-x-4 md:hidden">
              {socialLinks.map((link, index) => (
                <SocialIcon key={index} platform={link.platform} url={link.url} />
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default DefaultFooter;