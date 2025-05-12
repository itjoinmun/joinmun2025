import Footer from "@/modules/home/footer";
import Navbar from "@/components/Layout/navbar";
import React from "react";
import { isWebsiteRelease } from "@/utils/helpers/reveal";
import ComingSoon from "@/modules/coming-soon";

const WithNavbarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {isWebsiteRelease ? (
        <>
          <Navbar />
          {children}
          <Footer />
        </>
      ) : (
        <ComingSoon />
      )}
    </>
  );
};

export default WithNavbarLayout;
