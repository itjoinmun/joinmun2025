export type Event = {
  title: string;
  location: string;
  date: string;
  src: string;
};

export type EventSection = {
  section: string;
  events: Event[];
};

export const EVENTS: EventSection[] = [
  {
    section: "Pre-Event",
    events: [
      {
        title: "Roadshow",
        location: "at Several Places",
        date: "09 Mei",
        src: "pre-event-roadshow.webp",
      },
    ],
  },
  {
    section: "Main Event",
    events: [
      {
        title: "Opening Ceremony",
        location: "at Prambanan",
        date: "09 Mei",
        src: "main-event-opening.webp",
      },
      {
        title: "Committee Session",
        location: "at Royal Ambarrukmo",
        date: "09 Mei",
        src: "main-event-committee-session.webp",
      },
      {
        title: "Networking Night",
        location: "at Royal Ambarrukmo",
        date: "09 Mei",
        src: "main-event-networking-night.webp",
      },
      {
        title: "Cultural Day",
        location: "at Royal Ambarrukmo",
        date: "09 Mei",
        src: "main-event-cultural-day.webp",
      },
      {
        title: "Awarding Ceremony",
        location: "at Royal Ambarrukmo",
        date: "09 Mei",
        src: "main-event-awarding-ceremony.webp",
      },
    ],
  },
];
