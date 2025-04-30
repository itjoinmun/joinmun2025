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
        location: "high schools and universities in Yogyakarta",
        date: "09 Mei",
        src: "/lebron.webp",
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
        src: "/lebron.webp",
      },
      {
        title: "Committe Session",
        location: "at Royal Ambarrukmo",
        date: "09 Mei",
        src: "/lebron.webp",
      },
      {
        title: "Cultural Night",
        location: "at Royal Ambarrukmo",
        date: "09 Mei",
        src: "/lebron.webp",
      },
      {
        title: "Awarding & Closing Ceremony",
        location: "at Royal Ambarrukmo",
        date: "09 Mei",
        src: "/lebron.webp",
      },
    ],
  },
];
