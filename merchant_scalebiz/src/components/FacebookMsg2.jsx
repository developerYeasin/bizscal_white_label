import React from "react";
import MessengerCustomerChat from "react-messenger-customer-chat";

const FacebookMsg2 = ({ pageId, appId }) => {
  return (
    <div>
      {pageId && appId && (
        <MessengerCustomerChat
          pageId={pageId}
          appId={appId}
            htmlRef="Shop"
        />
      )}
    </div>
  );
};

export default FacebookMsg2;
