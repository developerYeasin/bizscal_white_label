// import React from "react";
// import { Link } from "react-router-dom";
// import ThemedButton from "./ThemedButton";
// import { useStorePath } from "@/hooks/use-store-path";

// const HeroBanner = ({ data }) => {
//   const { imageUrl, title, subtitle, ctaButton } = data;
//   const getPath = useStorePath();

//   return (
//     <section
//       className="relative w-full h-full md:min-h-[100vh] bg-cover bg-center flex items-center text-left"
//       style={{ backgroundImage: `url(${imageUrl})` }}
//     >
//       <div className="relative z-10 text-white flex flex-col w-full justify-center items-center md:block px-6 sm:p-4 sm:pl-10 md:pl-20 max-w-2xl">
//         {" "}
//         {/* Added padding and max-width */}
//         {title && (
//           <h1
//             className="text-3xl md:text-left text-center sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
//             style={{ fontFamily: `var(--dynamic-heading-font)` }}
//           >
//             {title}
//           </h1>
//         )}
//         {subtitle && (
//           <p
//             className="text-md md:text-left text-center sm:text-lg md:text-xl mb-8"
//             style={{ fontFamily: `var(--dynamic-body-font)` }}
//           >
//             {subtitle}
//           </p>
//         )}
//         {ctaButton && ctaButton.text && (
//           <Link to={getPath(ctaButton.link)}>
//             <ThemedButton>{ctaButton.text}</ThemedButton>
//           </Link>
//         )}
//       </div>
//     </section>
//   );
// };

// export default HeroBanner;

import React from "react";
import { Link } from "react-router-dom";
import ThemedButton from "./ThemedButton";
import { useStorePath } from "@/hooks/use-store-path";

const HeroBanner = ({ data }) => {
  const { imageUrl, title, subtitle, ctaButton } = data;
  const getPath = useStorePath();

  return (
    <section className="relative w-full overflow-hidden leading-[0] block">
      {/* Using an <img> tag instead of background-image ensures 
         the container height is ALWAYS 100% proportional to the image.
      */}
      <div className="relative w-full h-auto">
        <img
          src={imageUrl}
          alt={title || "Banner"}
          className="w-full h-auto object-contain block m-0 p-0"
        />

        {/* Overlay Container: This sits exactly on top of the image.
           We hide the Title/Subtitle on mobile if they are already in the image.
        */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center justify-center w-full h-full p-4 pointer-events-auto">
            
            {/* Show React text only on desktop to avoid cluttering the mobile image */}
            {title && (
              <h1 className="hidden md:block text-white text-4xl lg:text-6xl font-bold mb-4">
                {title}
              </h1>
            )}

            {/* The Dynamic Button - positioned over the image */}
            {ctaButton?.text && (
              <div className="mt-[10%] sm:mt-0"> 
                <Link to={getPath(ctaButton.link)}>
                  <ThemedButton className="text-sm sm:text-base md:text-lg px-2 py-1 sm:px-4 sm:py-2 md:px-8 md:py-3 shadow-xl">
                    {ctaButton.text}
                  </ThemedButton>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;