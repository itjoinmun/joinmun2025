import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
import Container from "@/components/ui/container";

export default function ComingSoon() {
  return (
    <main
      className={
        "relative flex min-h-[100dvh] w-screen items-center justify-center overflow-x-hidden *:text-center"
      }
    >
      {/* Background Batik */}
      <Image
        src={"/assets/coming-soon/batik-2.webp"}
        alt={""}
        className={"absolute top-0 z-10 min-h-[85vh] object-cover lg:h-auto lg:w-full"}
        width={2163}
        height={1220}
      />
      {/* Ellipse Blur */}
      <div className="bg-orange-blur/30 pointer-events-none absolute left-1/2 z-30 h-[350px] w-1/2 -translate-x-1/2 rounded-full blur-3xl" />
      {/* Pattern Wave Kiri */}
      <Image
        src={"/assets/coming-soon/wave.webp"}
        alt={""}
        className={
          "3xl:left-48 absolute -left-8 z-40 -translate-x-1/2 translate-y-[6.5rem] sm:translate-y-14 md:translate-y-24 lg:-left-24 lg:-translate-y-12 xl:-left-16 2xl:left-24"
        }
        width={850}
        height={126}
      />
      {/* Pattern Wave Kanan */}
      <Image
        src={"/assets/coming-soon/wave.webp"}
        alt={""}
        className={
          "3xl:right-48 absolute -right-8 z-40 translate-x-1/2 translate-y-[6.5rem] rotate-180 overflow-x-clip sm:translate-y-14 md:translate-y-24 lg:-right-24 lg:-translate-y-12 xl:-right-16 2xl:right-24"
        }
        width={850}
        height={126}
      />
      {/* Center Component */}
      <Container
        className={
          "relative z-50 flex flex-col items-center justify-center overflow-x-hidden sm:gap-0"
        }
      >
        <h1
          className={
            "font-outfit text-gradient-top from-white/20 to-white text-[56px] leading-none font-semibold md:text-[72px] md:leading-normal lg:text-[80px] xl:text-[90px]"
          }
        >
          COMING
          <br className="block sm:hidden" /> SOON
        </h1>
        <p className="text-xs lg:text-[120%]">
          We&#39;re putting the final touches on a premier platform <br className="block" />
          where youth, diplomacy, and innovation meet.
        </p>
        {/* Button Go Home */}
        <Link href={"/"} className={"mt-3 scale-75 sm:scale-90 md:mt-8 lg:scale-100"}>
          <Button variant={"gradient"} size={"longer"} className="cursor-pointer">
            Go Home
          </Button>
        </Link>
      </Container>
      {/* Socials */}
      <div className="absolute right-0 bottom-10 left-0 mx-auto">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-lg font-semibold">Stay Connected</h1>
          <div className="flex gap-4">
            {Socials.map((social, index) => (
              <Link key={index} href={social.link} className={"z-50 flex gap-4"}>
                <span className="flex h-10 w-10 items-center justify-center">{social.icon}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

const TikTok = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" height={24} width={24}>
      <g id="SVGRepo_bgCarrier"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M16.8217 5.1344C16.0886 4.29394 15.6479 3.19805 15.6479 2H14.7293M16.8217 5.1344C17.4898 5.90063 18.3944 6.45788 19.4245 6.67608C19.7446 6.74574 20.0786 6.78293 20.4266 6.78293V10.2191C18.645 10.2191 16.9932 9.64801 15.6477 8.68211V15.6707C15.6477 19.1627 12.8082 22 9.32386 22C7.50043 22 5.85334 21.2198 4.69806 19.98C3.64486 18.847 2.99994 17.3331 2.99994 15.6707C2.99994 12.2298 5.75592 9.42509 9.17073 9.35079M16.8217 5.1344C16.8039 5.12276 16.7861 5.11101 16.7684 5.09914M6.9855 17.3517C6.64217 16.8781 6.43802 16.2977 6.43802 15.6661C6.43802 14.0734 7.73249 12.7778 9.32394 12.7778C9.62087 12.7778 9.9085 12.8288 10.1776 12.9124V9.40192C9.89921 9.36473 9.61622 9.34149 9.32394 9.34149C9.27287 9.34149 8.86177 9.36884 8.81073 9.36884M14.7244 2H12.2097L12.2051 15.7775C12.1494 17.3192 10.8781 18.5591 9.32386 18.5591C8.35878 18.5591 7.50971 18.0808 6.98079 17.3564"
          stroke="#ffffff"
          strokeWidth="1.5"
        ></path>{" "}
      </g>
    </svg>
  );
};

const Socials = [
  {
    name: "Instagram",
    icon: <Instagram strokeWidth={1.5} />,
    link: "https://www.instagram.com/joinmun.ugm/",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin strokeWidth={1.5} />,
    link: "https://www.linkedin.com/company/jogjainternationalmodelunitednations/",
  },
  {
    name: "TikTok",
    icon: <TikTok />,
    link: "https://www.tiktok.com/@joinmun2025",
  },
];
