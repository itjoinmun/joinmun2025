import {
  DashboardModule,
  DashboardModuleDescription,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type DashboardEventType = {
  title: string;
  date: string;
  src: string;
  href: string;
};

const DASHBOARD_EVENTS: DashboardEventType[] = [
  {
    title: "Opening Ceremony",
    date: "20 January 2025 - 20 January 2025",
    src: "/apalah.webp",
    href: "/event-opening-ceremony",
  },
  {
    title: "Commmittee Session",
    date: "20 January 2025 - 20 January 2025",
    src: "/apalah.webp",
    href: "/event-committee-session",
  },
  {
    title: "Cultural Night",
    date: "20 January 2025 - 20 January 2025",
    src: "/apalah.webp",
    href: "/ilham",
  },
  {
    title: "Event 1",
    date: "20 January 2025 - 20 January 2025",
    src: "/apalah.webp",
    href: "/ilham",
  },
];

const DashboardEvents = () => {
  return (
    <DashboardModule className="">
      <DashboardModuleHeader>
        <DashboardModuleTitle>Events</DashboardModuleTitle>
        <DashboardModuleDescription className="text-sm text-pretty">
          Find detailed information for{" "}
          <Bold>competition details, study guides, and others!</Bold>{" "}
        </DashboardModuleDescription>
      </DashboardModuleHeader>

      <section className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {DASHBOARD_EVENTS.map((event, index) => (
          <DashboardEventCard {...event} key={index} />
        ))}
      </section>
    </DashboardModule>
  );
};

const DashboardEventCard = (props: DashboardEventType) => (
  <article className="relative flex min-h-60 flex-col justify-end gap-2.5 overflow-hidden rounded-lg p-2 text-start">
    <header className="space-y-1 px-1">
      <h1 className="text-lg leading-snug font-bold">{props.title}</h1>
      <p className="text-sm leading-snug">{props.date}</p>
    </header>
    <Link href={props.href} className={buttonVariants({ variant: "primary" })}>
      CTA
    </Link>

    <Image
      src={`/lebron.webp`}
      // src={`/assets/dashboard/home/events/${props.src}`}
      alt={props.title}
      fill
      sizes="50%"
      className="-z-10 object-cover"
    />
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/60 to-transparent" />
  </article>
);

const Bold = ({ children }: { children: React.ReactNode }) => (
  <span className="font-bold">{children}</span>
);

export default DashboardEvents;
