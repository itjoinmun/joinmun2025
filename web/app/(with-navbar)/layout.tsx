import Navbar from "@/modules/navbar";
import React from "react";

const WithNavbarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default WithNavbarLayout;
