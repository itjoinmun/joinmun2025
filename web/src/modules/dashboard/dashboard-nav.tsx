"use client";
import CompleteLogo from "@/components/dashboard/complete-logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/helpers/cn";
import { BookOpen, CircleHelp, DollarSign, Globe, Home, Hourglass, LogOut } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import DashboardContainer from "@/components/dashboard/dashboard-container";
import Image from "next/image";

const logoStyle = "size-5";

const NAV_LINKS = [
  {
    name: "Home",
    href: "/dashboard",
    logo: <Home className={logoStyle} />,
  },
  {
    name: "Delegates",
    href: "/dashboard/delegates",
    logo: <BookOpen className={logoStyle} />,
  },
  {
    name: "Councils",
    href: "/dashboard/councils",
    logo: <Globe className={logoStyle} />,
  },
  {
    name: "Pricing",
    href: "/dashboard/pricing",
    logo: <DollarSign className={logoStyle} />,
  },
  {
    name: "Timeline",
    href: "/dashboard/timeline",
    logo: <Hourglass className={logoStyle} />,
  },
  {
    name: "Help and Support",
    href: "/dashboard/help",
    logo: <CircleHelp className={logoStyle} />,
  },
];

const DashboardNav = () => {
  const pathname = usePathname();
  return (
    <>
      <MobileNav pathname={pathname} />
      <DummyNav pathname={pathname} />
      {/* <DesktopNav pathname={pathname} /> */}
    </>
  );
};

const DummyNav = ({ pathname }: { pathname: string }) => (
  <Sidebar className="hidden h-full md:block">
    <DashboardContainer className="bg-gray m-2 mr-0 flex h-full w-auto flex-col gap-4 rounded-md py-4 group-data-[collapsible=icon]:p-2">
      <SidebarHeader className="mt-2 w-auto">
        <Link href={`/dashboard`} className="flex w-full items-center gap-3 select-none">
          <Image
            src={`/LOGO.png`}
            alt="JOINMUN"
            width={846}
            height={701}
            priority
            className="aspect-[846/701] size-9 h-auto group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:h-full group-data-[collapsible=none]:w-full"
          />

          <div className="mr-1 flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
            <h1 className="font-bold text-nowrap">JOINMUN 2025</h1>
            <h3 className="text-xs text-nowrap">Model United Nations UGM</h3>
          </div>
        </Link>
      </SidebarHeader>

      <hr className="border-gray-light border-b" />

      <SidebarContent>
        <h2 className="group-data-[collapsible=icon]:hidden">Menu</h2>

        <SidebarGroup className="no-scrollbar mb-1 flex max-h-full flex-col gap-1.5 overflow-y-auto px-0">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                buttonVariants({ variant: pathname === link.href ? "primary" : "ghost" }),
                "group h-auto w-full justify-start gap-4 rounded-sm py-2.5 font-normal group-data-[collapsible=icon]:px-0",
                `${pathname === link.href && "hover:bg-red-normal"}`,
              )}
            >
              <span className="group-data-[collapsible=icon]:mx-auto">{link.logo}</span>
              <span className="block group-data-[collapsible=icon]:hidden">{link.name}</span>
            </Link>
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        <Button variant="default" className="w-full">
          <LogOut /> <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </Button>
      </SidebarFooter>
    </DashboardContainer>
  </Sidebar>
);

// const DesktopNav = ({ pathname }: { pathname: string }) => (
//   <aside className="bg-gray hidden h-full flex-col gap-4 rounded-md p-6 md:flex">
//     <CompleteLogo />

//     <hr className="border-gray-light/50 my-1 border-b" />

//     <h2>Menu</h2>

//     {/* nav links */}
//     <ul className="no-scrollbar mb-1 flex max-h-full flex-col gap-1.5 overflow-y-auto">
//       {NAV_LINKS.map((link) => (
//         <li key={link.name}>
//           <Link
//             href={link.href}
//             scroll={false}
//             className={cn(
//               buttonVariants({ variant: pathname === link.href ? "primary" : "ghost" }),
//               "h-auto w-full justify-start gap-4 rounded-sm py-2.5 font-normal",
//               `${pathname === link.href && "hover:bg-red-normal"}`,
//             )}
//           >
//             {link.logo} {link.name}
//           </Link>{" "}
//         </li>
//       ))}
//     </ul>

//     {/* logout */}
//     <Button variant="default" className="mt-auto w-full">
//       Logout
//     </Button>
//   </aside>
// );

const MobileNavButtons = ({ pathname, className }: { pathname: string; className?: string }) => (
  <nav
    className={cn(
      "no-scrollbar flex w-full max-w-full snap-x snap-mandatory gap-2 overflow-auto bg-transparent",
      className,
    )}
  >
    {NAV_LINKS.map((link, i) => (
      <Link
        href={link.href}
        key={i} // Using index as key is acceptable here as NAV_LINKS is static
        scroll={false} // Add scroll={false} to prevent page scroll reset
        className={cn(
          buttonVariants({ variant: pathname === link.href ? "primary" : "gray" }),
          "shrink-0 snap-start items-center rounded-sm transition-all",
        )}
      >
        {link.logo}
        {link.name}
      </Link>
    ))}
  </nav>
);

const MobileNav = ({ pathname }: { pathname: string }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // setIsScrolled(latest > 190);
    setIsScrolled(latest > 20);
  });

  return (
    <>
      <header
        className={cn(
          `bg-background/50 fixed inset-x-0 top-0 z-20 flex h-auto w-full flex-col gap-6 overflow-hidden px-4 py-4 backdrop-blur-sm transition-all ease-out md:hidden`,
          isScrolled ? "-top-22" : "",
        )}
      >
        <section className={`flex justify-between gap-4 transition-transform ease-out`}>
          <CompleteLogo />
        </section>

        <hr className="border-gray-light/50 border-b" />

        <nav className="space-y-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          {/* Use the standalone MobileNavButtons component */}
          <MobileNavButtons pathname={pathname} className="sticky top-0 w-full" />
        </nav>
      </header>

      {/* navbar resolver */}
      <div
        className={cn(
          `h-54 w-full shrink-0 transition-all ease-out md:hidden`,
          isScrolled && "h-30",
        )}
      />
    </>
  );
};

export default DashboardNav;
