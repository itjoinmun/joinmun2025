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
        date: "TBA",
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
        location: "Coming Soon",
        date: "31 Oct",
        src: "main-event-opening.webp",
        loc: "",
      },
      {
        title: "Committee Session",
        location: "Coming Soon",
        date: "1 - 2 Nov",
        src: "main-event-committee-session.webp",
        loc: "Coming Soon",
      },
      {
        title: "Networking Night",
        location: "Coming Soon",
        date: "1 Nov",
        src: "main-event-networking-night.webp",
        loc: "Coming Soon",
      },
      {
        title: "Cultural Day",
        location: "Coming Soon",
        date: "2 Nov",
        src: "main-event-cultural-day.webp",
        loc: "Coming Soon",
      },
      {
        title: "Awarding Ceremony",
        location: "Coming Soon",
        date: "2 Nov",
        src: "main-event-awarding-ceremony.webp",
        loc: "Coming Soon",
      },
      // {
      //   title: "Opening Ceremony",
      //   location: "at Prambanan",
      //   date: "31 Oct",
      //   src: "main-event-opening.webp",
      //   loc: "https://maps.app.goo.gl/dteZUHp4wAyvuUEs8",
      // },
      // {
      //   title: "Committee Session",
      //   location: "at Royal Ambarrukmo",
      //   date: "1 - 2 Nov",
      //   src: "main-event-committee-session.webp",
      //   loc: "https://maps.app.goo.gl/r4EfgQtxUd5r46DU9",
      // },
      // {
      //   title: "Networking Night",
      //   location: "at Royal Ambarrukmo",
      //   date: "1 Nov",
      //   src: "main-event-networking-night.webp",
      //   loc: "https://maps.app.goo.gl/r4EfgQtxUd5r46DU9",
      // },
      // {
      //   title: "Cultural Day",
      //   location: "at Royal Ambarrukmo",
      //   date: "2 Nov",
      //   src: "main-event-cultural-day.webp",
      //   loc: "https://maps.app.goo.gl/r4EfgQtxUd5r46DU9",
      // },
      // {
      //   title: "Awarding Ceremony",
      //   location: "at Royal Ambarrukmo",
      //   date: "2 Nov",
      //   src: "main-event-awarding-ceremony.webp",
      //   loc: "https://maps.app.goo.gl/r4EfgQtxUd5r46DU9",
      // },
    ],
  },
];
