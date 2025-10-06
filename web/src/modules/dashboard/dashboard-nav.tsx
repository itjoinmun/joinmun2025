"use client";
import CompleteLogo from "@/components/dashboard/complete-logo";
import DashboardContainer from "@/components/dashboard/dashboard-container";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { clearCookies } from "@/utils/actions/auth-handler";
import { cn } from "@/utils/helpers/cn";
import {
  BookOpen,
  CircleHelp,
  DollarSign,
  Globe,
  Home,
  Hourglass,
  InfoIcon,
  LogOut,
} from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const logoStyle = "size-5";

const NAV_LINKS = [
  {
    id: "home",
    name: "Home",
    href: "/dashboard/home",
    logo: <Home className={logoStyle} />,
  },
  {
    id: "registration",
    name: "Registration",
    href: "/dashboard/delegates",
    logo: <BookOpen className={logoStyle} />,
  },
  ...(process.env.NEXT_PUBLIC_TIMELINE_AND_STUDY_GUIDE_REVEAL === "true"
    ? [
        {
          id: "councils",
          name: "Councils",
          href: "/dashboard/councils",
          logo: <Globe className={logoStyle} />,
        },
        {
          id: "timeline",
          name: "Timeline",
          href: "/dashboard/timeline",
          logo: <Hourglass className={logoStyle} />,
        },
      ]
    : []),
  {
    id: "payment",
    name: "Payment",
    href: "/dashboard/payment",
    logo: <DollarSign className={logoStyle} />,
  },
  {
    id: "help",
    name: "Help and Support",
    href: "https://www.instagram.com/direct/t/114960663222344",
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

const DummyNav = ({ pathname }: { pathname: string }) => {
  // const router = useRouter();

  // const handleLogout = async () => {
  //   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`, {
  //     credentials: "include",
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });

  //   if (res.ok) {
  //     router.push("/");
  //   }
  // };

  return (
    <Sidebar className="hidden h-full md:block">
      <DashboardContainer className="bg-gray m-2 mr-0 flex h-full w-auto flex-col gap-4 rounded-md py-4 group-data-[collapsible=icon]:p-2">
        <SidebarHeader className="mt-2 w-auto">
          <Link href={`/dashboard/home`} className="flex w-full items-center gap-3 select-none">
            <Image
              src={`/LOGO.png`}
              alt="JOINMUN"
              width={846}
              height={701}
              priority
              className="aspect-[846/701] size-9 h-auto group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:h-full group-data-[collapsible=none]:w-full"
            />

            <div className="mr-1 flex flex-col group-data-[collapsible=icon]:hidden">
              <h1 className="font-bold text-nowrap">JOINMUN 2025</h1>
              <h3 className="text-xs text-nowrap">UGM MUN</h3>
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
                  buttonVariants({ variant: pathname.startsWith(link.href) ? "primary" : "ghost" }),
                  "group h-auto w-full justify-start gap-4 rounded-sm py-2.5 font-normal group-data-[collapsible=icon]:px-0",
                  `${pathname.startsWith(link.href) && "hover:bg-red-normal"}`,
                )}
              >
                <span className="group-data-[collapsible=icon]:mx-auto">{link.logo}</span>
                <span className="block group-data-[collapsible=icon]:hidden">{link.name}</span>
              </Link>
            ))}
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="mt-auto">
          <LogoutButton />
        </SidebarFooter>
      </DashboardContainer>
    </Sidebar>
  );
};

const MobileNavButtons = ({ pathname, className }: { pathname: string; className?: string }) => {
  return (
    <nav
      className={cn(
        "no-scrollbar flex w-full max-w-full snap-x snap-mandatory gap-2 overflow-auto bg-transparent",
        className,
      )}
    >
      {NAV_LINKS.map((link) => (
        <Link
          href={link.href}
          key={link.id}
          scroll={false}
          className={cn(
            buttonVariants({ variant: pathname.startsWith(link.href) ? "primary" : "gray" }),
            "shrink-0 snap-start items-center rounded-sm transition-all",
          )}
        >
          {link.logo}
          {link.name}
        </Link>
      ))}
      <LogoutButton />
    </nav>
  );
};

const MobileNav = ({ pathname }: { pathname: string }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
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
          <MobileNavButtons pathname={pathname} className="sticky top-0 w-full" />
        </nav>
      </header>

      <div
        className={cn(
          `h-54 w-full shrink-0 transition-all ease-out md:hidden`,
          isScrolled && "h-30",
        )}
      />
    </>
  );
};

type LogoutButtonProps = {
  isAdmin?: boolean;
};

export const LogoutButton = ({ isAdmin }: LogoutButtonProps) => {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setPending(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      clearCookies();
      setPending(false);
      return;
    }

    router.push("/");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={isAdmin ? "white" : "default"}
          className={cn("cursor-pointer", isAdmin ? "md:w-fit" : "md:w-full")}
          size={isAdmin ? "sm" : "default"}
        >
          <LogOut /> <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="*:text-start">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <InfoIcon className="size-5" /> Are you sure you want to log out?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will be logged out of your account and redirected to the home page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <Button
            onClick={handleLogout}
            disabled={pending}
            variant={`primary`}
            className="cursor-pointer"
          >
            {pending ? "Logging out..." : "Log out"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DashboardNav;
