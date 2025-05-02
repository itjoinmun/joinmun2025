import Container from "@/components/ui/container";
import { cn } from "@/utils/cn";
import { Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const TikTok = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" height={24} width={24}>
      <g id="SVGRepo_bgCarrier"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M16.8217 5.1344C16.0886 4.29394 15.6479 3.19805 15.6479 2H14.7293M16.8217 5.1344C17.4898 5.90063 18.3944 6.45788 19.4245 6.67608C19.7446 6.74574 20.0786 6.78293 20.4266 6.78293V10.2191C18.645 10.2191 16.9932 9.64801 15.6477 8.68211V15.6707C15.6477 19.1627 12.8082 22 9.32386 22C7.50043 22 5.85334 21.2198 4.69806 19.98C3.64486 18.847 2.99994 17.3331 2.99994 15.6707C2.99994 12.2298 5.75592 9.42509 9.17073 9.35079M16.8217 5.1344C16.8039 5.12276 16.7861 5.11101 16.7684 5.09914M6.9855 17.3517C6.64217 16.8781 6.43802 16.2977 6.43802 15.6661C6.43802 14.0734 7.73249 12.7778 9.32394 12.7778C9.62087 12.7778 9.9085 12.8288 10.1776 12.9124V9.40192C9.89921 9.36473 9.61622 9.34149 9.32394 9.34149C9.27287 9.34149 8.86177 9.36884 8.81073 9.36884M14.7244 2H12.2097L12.2051 15.7775C12.1494 17.3192 10.8781 18.5591 9.32386 18.5591C8.35878 18.5591 7.50971 18.0808 6.98079 17.3564"
          stroke="#ffffff"
          strokeWidth="1.5"
        ></path>
      </g>
    </svg>
  );
};

const FOOTOER_CONTENT = [
  {
    title: "Event Info",
    content: [
      { name: "Rundown", link: "/#rundown" },
      { name: "Councils", link: "/#councils" },
      { name: "Pricing", link: "/#pricing" },
    ],
  },
  {
    title: "Contact Us",
    content: [
      { name: "Phone", link: "/service1" },
      { name: "Email", link: "/service2" },
      { name: "Address", link: "/service3" },
    ],
  },
  {
    title: "Account",
    content: [
      { name: "Login", link: "/login" },
      { name: "Register", link: "/register" },
      { name: "Forgot Password", link: "/forgot-password" },
    ],
  },
  {
    title: "Follow Us",
    content: [
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
      { name: "TikTok", icon: <TikTok />, link: "https://www.tiktok.com/@joinmun2025" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-background pt-8">
      <Container>
        {/* Mobile Layout */}
        <div className="mx-auto block w-fit px-10 sm:px-16 md:hidden">
          <TopFooter />
          <div className="2xs:gap-x-6 xs:gap-x-16 grid grid-cols-2 gap-x-3 gap-y-14 sm:gap-x-24">
            {FOOTOER_CONTENT.map((section, idx) => (
              <div key={idx} className="w-fit">
                <h3 className="mb-2 text-lg font-semibold sm:text-xl">{section.title}</h3>
                {section.title === "Follow Us" ? (
                  <ul className="flex flex-row gap-2">
                    {section.content.map((link, i) => (
                      <li key={i} className="flex items-center gap-x-1">
                        <Link
                          href={link.link}
                          className="bg-red-normal rounded-md p-1.5 text-sm hover:underline sm:text-base"
                        >
                          {link.icon}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-3">
                    {section.content.map((link, i) => (
                      <li key={i} className={cn("flex items-center justify-start gap-x-2")}>
                        <a
                          href={link.link}
                          className="text-sm text-nowrap hover:underline sm:text-base"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden justify-between gap-x-10 md:grid md:grid-cols-7 lg:grid-cols-6">
          <div className="col-span-2 lg:ml-10">
            <TopFooter />
          </div>
          {FOOTOER_CONTENT.map((section, idx) => (
            <div key={idx}>
              <h3
                className={cn("mb-2 text-sm font-bold text-nowrap", {
                  "xl:ml-0": section.title === "Follow Us",
                })}
              >
                {section.title}
              </h3>
              {/* MARKER */}
              {section.title === "Follow Us" ? (
                <ul className="flex flex-row gap-2 xl:ml-0">
                  {section.content.map((link, i) => (
                    <li key={i} className="flex items-center gap-x-1">
                      <Link
                        href={link.link}
                        className="bg-red-normal rounded-md p-1.5 text-sm hover:underline sm:text-base"
                      >
                        {link.icon}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-1">
                  {section.content.map((link, i) => (
                    <li key={i}>
                      <Link href={link.link} className="text-sm text-nowrap hover:underline">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

const TopFooter = () => {
  return (
    <div className="mb-14">
      {/* <div> */}
      <div className="mr-auto flex items-center justify-start gap-x-5 select-none md:w-full md:gap-x-2 xl:w-auto">
        <div className="relative aspect-[846/701] min-w-20 md:w-10">
          <Image
            src={`/LOGO.png`}
            alt="JOINMUN"
            priority
            fill
            sizes="50%"
            className="object-cover"
          />
        </div>

        <h1 className="xs:block text-xl font-bold text-nowrap sm:text-2xl md:block md:text-xl">
          JOINMUN
        </h1>
        <h1 className="hidden w-auto text-xl font-bold text-wrap sm:text-2xl md:hidden">
          Jogjakarta International Model United Nations 2025
        </h1>
      </div>
      <h3 className="mt-4 w-full text-xs text-pretty">
        Lorem ipsum dolor sit amet consectetur. Ac at consectetur ac praesent.
      </h3>
    </div>
  );
};
