import Councils from "@/modules/home/councils";
import Events from "@/modules/home/events";
import Footer from "@/modules/home/footer";
import Hero from "@/modules/home/hero";
import HomeTheme from "@/modules/home/home-theme";
import Pricing from "@/modules/home/pricing";
import Timeline from "@/modules/home/timeline";
import { Test } from "@/modules/temp";
import Welcome from "@/modules/welcome";
import WelcomingRemarks from "@/modules/welcoming-remarks";

export default function Home() {
  return (
    <>
      <Hero />
      <Timeline />
      <HomeTheme />
      <WelcomingRemarks />
      <Events />
      <Councils />
      <Pricing />
      {/* <WelcomingRemarks /> */}
      {/* <Welcome /> */}
      {/* <Test /> */}
    </>
  );
}
