"use client";
import CompleteLogo from "@/components/dashboard/complete-logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { BookOpen, CircleHelp, DollarSign, Globe, Home } from "lucide-react";
import { AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import * as motion from "motion/react-client";
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
    <ul className="no-scrollbar mb-8 flex max-h-full flex-col gap-1.5 overflow-y-auto">
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
    console.log(scrollY.get());
    setIsScrolled(latest > 190);
  });

  const MobileNavButtons = ({ className }: { className?: string }) => (
    <nav
      className={cn(
        "no-scrollbar bg-background flex w-full max-w-full snap-x snap-mandatory gap-2 overflow-auto",
        className,
      )}
    >
      {NAV_LINKS.map((link, i) => (
        <Button
          key={i}
          variant={pathname === link.href ? "primary" : "gray"}
          className="shrink-0 snap-start items-center rounded-sm transition-all"
        >
          {link.logo}
          {link.name}
        </Button>
      ))}
    </nav>
  );

  return (
    <>
      <header className="flex flex-col gap-6 md:hidden">
        <section className="flex justify-between gap-4">
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

      <AnimatePresence>
        {isScrolled && (
            <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              mass: 0.85
            }}
            className="bg-background/95 backdrop-blur-sm fixed inset-x-4 top-2 z-30 rounded-lg py-2 shadow-xl border border-gray-light/20"
            >
            <MobileNavButtons className="bg-transparent" />
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardNav;
