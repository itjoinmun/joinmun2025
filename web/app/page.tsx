import Navbar from "@/modules/home/navbar";
import Hero from "@/modules/home/hero";
import { Test } from "@/modules/temp";
import Welcome from "@/modules/welcome";
import NavbarResolver from "@/modules/home/navbar-resolver";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Welcome />
      <Test />
    </>
  );
}
