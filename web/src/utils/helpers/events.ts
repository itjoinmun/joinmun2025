export type Event = {
  title: string;
  location: string;
  date: string;
  src: string;
  loc: string;
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
        date: "?",
        src: "pre-event-roadshow.webp",
        loc: "",
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
        loc: "https://maps.app.goo.gl/dteZUHp4wAyvuUEs8",
      },
      {
        title: "Committee Session",
        location: "at Royal Ambarrukmo",
        date: "09 Mei",
        src: "main-event-committee-session.webp",
        loc: "https://maps.app.goo.gl/r4EfgQtxUd5r46DU9",
      },
      {
        title: "Networking Night",
        location: "at Royal Ambarrukmo",
        date: "09 Mei",
        src: "main-event-networking-night.webp",
        loc: "https://maps.app.goo.gl/r4EfgQtxUd5r46DU9",
      },
      {
        title: "Cultural Day",
        location: "at Royal Ambarrukmo",
        date: "09 Mei",
        src: "main-event-cultural-day.webp",
        loc: "https://maps.app.goo.gl/r4EfgQtxUd5r46DU9",
      },
      {
        title: "Awarding Ceremony",
        location: "at Royal Ambarrukmo",
        date: "09 Mei",
        src: "main-event-awarding-ceremony.webp",
        loc: "https://maps.app.goo.gl/r4EfgQtxUd5r46DU9",
      },
    ],
  },
];
