import React from "react";
import { Link } from "react-router-dom";
import ThemedButton from "@/components/ThemedButton";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useStorePath } from "@/hooks/use-store-path";

const MidPageCallToAction = ({ data, className }) => {
  const { imageUrl, pretitle, title, subtitle, ctaButton } = data;
  const getPath = useStorePath();

  if (!imageUrl && !title) {
    return null;
  }

  return (
    <section
      className={cn(
        "relative w-full h-[400px] md:h-[500px] bg-cover bg-center flex items-center justify-center text-center py-12 bg-fixed ",
        className
      )}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div> {/* Dark overlay */}
      <div className="relative z-10 text-white px-4 max-w-3xl">
        {pretitle && (
          <p className="text-sm md:text-base font-medium uppercase tracking-widest mb-2 text-gray-200">
            {pretitle}
          </p>
        )}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
          style={{ fontFamily: `var(--dynamic-heading-font)` }}
        >
          {title}
        </h2>
        {subtitle && <p className="text-md sm:text-lg mb-8">{subtitle}</p>}
        <div className=" flex justify-center items-center  ">
          {ctaButton && (
            <Link
              to={getPath(ctaButton.link)}
              className="text-lg py-4 px-[45px] bg-[#ffffff] flex items-center justify-center gap-4 max-w-[255px] text-[#111] hover:bg-[#347bf0] hover:text-[#fff] "
            >
              {ctaButton.text}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default MidPageCallToAction;