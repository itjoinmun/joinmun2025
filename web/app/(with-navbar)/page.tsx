import Hero from "@/modules/home/hero";
import AboutUs from "@/modules/about-us";
import Timeline from "@/modules/home/timeline";
import HomeTheme from "@/modules/home/home-theme";
import WelcomingRemarks from "@/modules/welcoming-remarks";
import Events from "@/modules/home/events";
import Councils from "@/modules/home/councils";
import ContactUs from "@/modules/contact-us";
import Pricing from "@/modules/home/pricing";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutUs />
      <Timeline />
      <HomeTheme />
      <WelcomingRemarks />
      <Events />
      <Councils />
      <ContactUs />
      <Pricing />
    </>
  );
}
