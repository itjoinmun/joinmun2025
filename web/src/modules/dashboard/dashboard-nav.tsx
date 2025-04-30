"use client";
import CompleteLogo from "@/components/dashboard/complete-logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { BookOpen, CircleHelp, DollarSign, Globe, Home } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
      <DesktopNav pathname={pathname} />
    </>
  );
};

const DesktopNav = ({ pathname }: { pathname: string }) => (
  <aside className="bg-gray hidden h-full flex-col gap-4 rounded-md p-6 md:flex">
    <CompleteLogo />

    <hr className="border-gray-light/50 my-1 border-b" />

    <h2>Menu</h2>

    {/* nav links */}
    <ul className="no-scrollbar mb-1 flex max-h-full flex-col gap-1.5 overflow-y-auto">
      {NAV_LINKS.map((link) => (
        <li key={link.name}>
          <Link
            href={link.href}
            className={cn(
              buttonVariants({ variant: pathname === link.href ? "primary" : "ghost" }),
              "h-auto w-full justify-start gap-4 rounded-sm py-2.5 font-normal",
              `${pathname === link.href && "hover:bg-red-normal"}`,
            )}
          >
            {link.logo} {link.name}
          </Link>{" "}
        </li>
      ))}
    </ul>

    {/* logout */}
    <Button variant="default" className="mt-auto w-full">
      Logout
    </Button>
  </aside>
);

const MobileNav = ({ pathname }: { pathname: string }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // setIsScrolled(latest > 190);
    setIsScrolled(latest > 60);
  });

  const MobileNavButtons = ({ className }: { className?: string }) => (
    <nav
      className={cn(
        "no-scrollbar flex w-full max-w-full snap-x snap-mandatory gap-2 overflow-auto bg-transparent",
        className,
      )}
    >
      {NAV_LINKS.map((link, i) => (
        <Link
          href={link.href}
          key={i}
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

  return (
    <>
      <header
        className={`inset bg-background/70 fixed top-0 z-20 flex w-full flex-col gap-6 py-4 backdrop-blur-sm transition-transform ease-out md:hidden ${isScrolled && "-translate-y-22"}`}
      >
        <section
          className={`flex justify-between gap-4 transition-transform ease-out ${isScrolled && ""}`}
        >
          <CompleteLogo />
        </section>

        <hr className="border-gray-light/50 border-b" />

        <nav className="space-y-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <MobileNavButtons />

          {/* <h2 className="text-gold mt-4 font-normal">
            {NAV_LINKS.find((link) => link.href === pathname)?.name}
          </h2> */}
        </nav>
      </header>

      {/* navbar resolver */}
      <div className={`h-43 w-full md:hidden`} />

      {/* <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -5, opacity: 0 }}
            transition={{
              ease: easeOut,
              // stiffness: 120,
              // damping: 20,
              // mass: 0.85,
            }}
            className="bg-background/70 border-gray-light/20 fixed inset-x-0 top-0 z-30 border-b px-4 py-4 shadow-xl backdrop-blur-sm"
          >
            <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
            <MobileNavButtons className="" />
          </motion.div>
        )}
      </AnimatePresence> */}
    </>
  );
};

export default DashboardNav;
