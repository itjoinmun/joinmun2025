"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/utils/cn";
import { ChevronRight, Menu, X } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import Logo from "../components/logo";
import { Button, buttonVariants } from "../components/ui/button";
import Container from "@/components/ui/container";

const NAV_LINKS = [
  {
    name: "Theme",
    href: "/#theme",
  },
  {
    name: "Rundown",
    href: "/#rundown",
  },
  {
    name: "Councils",
    href: "/#councils",
  },
  {
    name: "Pricing",
    href: "/#pricing",
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
      className={`bg-background fixed z-40 flex h-16 items-center transition-all duration-500 ease-out ${
        isScrolled
          ? "inset-x-0 top-0 md:inset-x-5 md:top-5 md:rounded-2xl md:shadow-2xl"
          : "inset-x-0 top-0"
      }`}
    >
      <Container className="mx-auto max-w-none flex-row items-center justify-between gap-8 py-0">
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

    {/* login + signup */}
    <Link href={`/login`} className={buttonVariants({ variant: "outline" })}>
      Log in
    </Link>
    <Link href={`/signup`} className={buttonVariants({ variant: "gray" })}>
      Register
    </Link>
  </div>
);

const MobileNav = () => (
  <div className="flex md:hidden">
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="sr-only">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">Sidebar for mobile view</SheetDescription>
        </SheetHeader>
        <Container className="mb-8 py-5 justify-between h-full px-8">
          <section className="flex w-full items-center justify-between gap-4 border-b pb-4">
            <Logo />
            <SheetClose asChild>
              <Button variant="outline" size={`icon`} className="size-5 rounded-xs border-[1.5px]">
                <X className="size-4" />
              </Button>
            </SheetClose>
          </section>

          <section className="flex flex-col gap-6 pt-4">
            {NAV_LINKS.map((nav, i) => (
              <Link
                href={nav.href}
                key={i}
                className={`flex w-full items-center justify-between gap-4 text-base`}
              >
                <div>{nav.name}</div>
                <ChevronRight className="size-5" />
              </Link>
            ))}
          </section>

          <section className="mt-auto grid w-full grid-cols-2 gap-2">
            <Link
              href={`/login`}
              className={cn(buttonVariants({ variant: "outline" }), "w-full bg-white text-black")}
            >
              Log in
            </Link>
            <Link href={`/signup`} className={cn(buttonVariants({ variant: "gray" }), "w-full")}>
              Register
            </Link>
          </section>
        </Container>
      </SheetContent>
    </Sheet>
  </div>
);

export default Navbar;
