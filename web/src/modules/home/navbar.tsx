"use client";
import Link from "next/link";
import Logo from "../../components/Layout/logo";
import Container from "../../components/ui/container";
import { buttonVariants } from "../../components/ui/button";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

const NAV_LINKS = [
  {
    name: "Theme",
    href: "/theme",
    scroll: false,
  },
  {
    name: "Rundown",
    href: "#rundown",
    scroll: true,
  },
  {
    name: "Councils",
    href: "/councils",
    scroll: true,
  },
  {
    name: "Pricing",
    href: "/pricing",
    scroll: true,
  },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  return (
    <nav
      className={`bg-background fixed z-40 flex h-16 items-center transition-all duration-500 ease-in-out ${
        isScrolled
          ? "inset-x-0 top-0 md:inset-x-5 md:top-5 md:rounded-2xl md:shadow-md"
          : "inset-x-0 top-0"
      }`}
    >
      <Container className="max-w-none flex-row items-center justify-between gap-8 py-0">
        <Logo />

        <DesktopNav />
        <MobileNav />
      </Container>
    </nav>
  );
};

const DesktopNav = () => (
  <div className="hidden gap-2 md:flex">
    {/* nav links */}
    {NAV_LINKS.map((nav, i) => (
      <Link href={nav.href} key={i} className={buttonVariants({ variant: "link" })}>
        {nav.name}
      </Link>
    ))}

    {/* login + register */}
    <Link href={`/login`} className={buttonVariants({ variant: "outline" })}>
      Log in
    </Link>
    <Link href={`/register`} className={buttonVariants({ variant: "gray" })}>
      Register
    </Link>
  </div>
);

const MobileNav = () => <div className="flex md:hidden">mobile</div>;

export default Navbar;
