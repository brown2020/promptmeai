"use client";

import CookieConsent from "react-cookie-consent";

const CookieProvider = () => {
  return (
    typeof window !== "undefined" &&
    !window.ReactNativeWebView && (
      <CookieConsent>
        This app uses cookies to enhance the user experience.
      </CookieConsent>
    )
  );
};

export default CookieProvider;
