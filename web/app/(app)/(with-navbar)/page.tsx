import Hero from "@/modules/home/hero";
import AboutUs from "@/modules/home/about-us";
import Timeline from "@/modules/home/timeline";
import HomeTheme from "@/modules/home/home-theme";
import WelcomingRemarks from "@/modules/home/welcoming-remarks";
import Events from "@/modules/home/events";
import Councils from "@/modules/home/councils";
import ContactUs from "@/modules/home/contact-us";
// import Pricing from "@/modules/home/pricing";
import Articles from "@/modules/home/articles";
import Skiper30 from "@/components/ui/skiper-ui/skiper30";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutUs />
      <Articles />
      <HomeTheme />
      <WelcomingRemarks />
      <Timeline />
      <Events />
      <Councils />
      <ContactUs />
      <Skiper30 />
      {/*<Pricing />*/}
    </>
  );
}
