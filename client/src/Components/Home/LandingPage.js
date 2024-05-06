import React from "react";
import "./LandingPage.scss";

const LandingPage = () => {
  return (
    <div className="container">
      <div className="container__text">
        <div className="header">
          Sentinals of Your Confidentiality: Protecting Your Important Documents
        </div>
        <div className="summary">
          Take control of the privacy of your precious documents by using
          InfoSentinel, ensuring that only those you've granted access can use
          them.
        </div>
      </div>
      <div className="container__anim"></div>
    </div>
  );
};

export default LandingPage;
