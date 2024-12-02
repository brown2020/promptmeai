import React from "react";
import Image, { StaticImageData } from "next/image";
import GreenWhiteLayout from "@/layouts/GreenWhiteLayout";

type SupportScreenProps = {
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  companyLocation: string;
  updatedAt: string;
  companyLogo: StaticImageData;
};

const SupportScreen = ({
  companyName,
  companyEmail,
  companyAddress,
  companyLocation,
  updatedAt,
  companyLogo,
}: SupportScreenProps) => {
  return (
    <GreenWhiteLayout>
      <div className="text-wrapper">
        <div className="flex justify-center mb-6">
          <Image
            src={companyLogo}
            alt={`${companyName} Logo`}
            className="w-24 h-24 object-contain"
          />
        </div>

        <h3>{companyName}</h3>

        <h4>Contact Information</h4>
        <p>
          {companyName} welcomes your questions or comments regarding this
          application. If you have any questions or doubts about the
          application, please contact {companyName} at:
        </p>

        <div className="mb-4">
          <p>{companyName}</p>
          <p>{companyAddress}</p>
          <p>{companyLocation}</p>
        </div>

        <div className="mb-6">
          <p>Email Address:</p>
          <a
            href={`mailto:${companyEmail}`}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            {companyEmail}
          </a>
        </div>

        <span>Last updated: {updatedAt}</span>
      </div>
    </GreenWhiteLayout>
  );
};

export default SupportScreen;
