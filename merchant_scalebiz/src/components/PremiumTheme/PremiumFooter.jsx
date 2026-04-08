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

const PremiumFooter = ({ layout, copyrightText, socialLinks, logoUrl, storeName }) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const columns = layout?.columns || [];
  const getPath = useStorePath(); // Initialize useStorePath

  return (
    <footer className="bg-background text-foreground py-8 px-0 sm:px-6 border-t border-border">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Store Info & Social */}
          <div className="flex flex-col space-y-4">
            {logoUrl && (
              <Link to={getPath("/")} className="flex items-center mb-4">
                <img src={logoUrl} alt={storeName} className="h-10" />
              </Link>
            )}
            <div className="flex space-x-4 mb-4">
              {socialLinks.map((link, index) => (
                <SocialIcon key={index} platform={link.platform} url={link.url} />
              ))}
            </div>
            {layout.storeInfo && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{layout.storeInfo.address}</p>
                <p>{layout.storeInfo.phone}</p>
                <p>{layout.storeInfo.email}</p>
                <p>{layout.storeInfo.website}</p>
              </div>
            )}
          </div>

          {/* Column 2: Newsletter & Links 1 */}
          <div className="flex flex-col space-y-4">
            {layout.newsletter && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2" style={{ color: `var(--dynamic-primary-color)` }}>{t('newsletter')}</h3>
                <div className="flex">
                  <Input type="email" placeholder={layout.newsletter.placeholder} className="flex-grow rounded-r-none" />
                  <Button className="rounded-l-none bg-dynamic-primary-color text-dynamic-secondary-color hover:brightness-110">
                    {layout.newsletter.buttonText}
                  </Button>
                </div>
              </div>
            )}
            {columns && columns[0] && (
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: `var(--dynamic-primary-color)` }}>{columns[0].title}</h3>
                <ul className="space-y-2">
                  {columns[0].links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link to={getPath(link.path)} className="text-foreground hover:text-dynamic-primary-color transition-colors text-sm">
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Column 3: Links 2 & Opening Hours */}
          <div className="flex flex-col space-y-4">
            {columns && columns[1] && (
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: `var(--dynamic-primary-color)` }}>{columns[1].title}</h3>
                <ul className="space-y-2">
                  {columns[1].links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link to={getPath(link.path)} className="text-foreground hover:text-dynamic-primary-color transition-colors text-sm">
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {layout.openingHours && layout.openingHours.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: `var(--dynamic-primary-color)` }}>{t('opening_hours')}</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {layout.openingHours.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.day}:</span>
                      <span>{item.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Column 4: Payment Icons */}
          <div className="flex flex-col items-start lg:items-end">
            {layout.paymentIcons && layout.paymentIcons.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-4" style={{ color: `var(--dynamic-primary-color)` }}>{t('payment_methods')}</h3>
                <div className="flex flex-wrap flex-col gap-2">
                  {layout.paymentIcons.map((iconUrl, index) => (
                    <img key={index} src={iconUrl} alt="Payment Method" className="w-full max-w-[150px] h-auto" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">{copyrightText}</p>
          {layout.bottomLinks && (
            <div className="flex flex-wrap justify-center md:justify-end space-x-4 text-sm">
              {layout.bottomLinks.map((link, index) => (
                <Link key={index} to={getPath(link.path)} className="text-foreground hover:text-dynamic-primary-color transition-colors">
                  {link.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default PremiumFooter;