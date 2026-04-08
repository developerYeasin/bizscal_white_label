import React, { useEffect } from "react";

const FacebookMsg = ({ pageId, enabled }) => {
  
  
    console.log("FacebookMsg - pageId:", pageId, "enabled:", enabled);


  useEffect(() => {
    if (!enabled || !pageId) return;

    // 1. Define the initialization function
    window.fbAsyncInit = function () {
      window.FB.init({
        xfbml: true,
        version: "v18.0", // Use the latest API version
      });
    };

    // 2. Load the SDK asynchronously
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return; // Prevent multiple script loads
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");

    // Cleanup function to potentially remove the script if the component unmounts or pageId/enabled changes
    return () => {
      // This is a simple cleanup. A more robust solution might involve checking if other components need the SDK
      // and only removing it if no longer needed globally. For this task, we'll keep it simple.
      const scriptElement = document.getElementById("facebook-jssdk");
      if (scriptElement) {
        // scriptElement.remove(); // Removing the script might break other Facebook SDK integrations
      }
      if (window.FB) {
        // window.FB.destroy(); // There's no direct FB.destroy method for cleanup typically.
      }
    };
  }, [pageId, enabled]);

  if (!enabled || !pageId) {
    return null; // Don't render anything if not enabled or pageId is missing
  }

  return (
    <div>
      <div id="fb-root"></div>
      {/* 3. The Chat Plugin Code */}
      <div
        className="fb-customerchat"
        attribution="biz_inbox"
        page_id={pageId} // Replace with your Page ID
      ></div>
    </div>
  );
};

export default FacebookMsg;
