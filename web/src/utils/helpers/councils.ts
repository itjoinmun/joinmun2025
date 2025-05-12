export type Council = {
  slug: string;
  delegate: string;
  name: string;
  fullname: string;
  src: string;
  logo: string;
  quote: string;
  description: string;
  chairs: {
    name: string;
    role: string;
    image: string;
    experiences: string[];
  }[];
};

export const COUNCILS = [
  {
    slug: "un-women",
    delegate: "Single",
    name: "UN Women",
    fullname: "UN Women",
    src: "un-women.webp",
    logo: "UN Women.webp",
    quote: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    chairs: [
      {
        name: "Olivia Davis",
        role: "Head Chair",
        image: "olivia-davis-1.jpg",
        experiences: [
          "Best Delegate Winner",
          "Best Delegate",
          "Chair of WHO in ABCMUN 2023",
          "Best Delegate",
        ],
      },
      {
        name: "Sophia Lee",
        role: "Vice Chair",
        image: "sophia-lee.jpg",
        experiences: [
          "Co-Chair of UNICEF 2022",
          "Outstanding Delegate",
          "Chair of UNHRC in UGM MUN 2023",
        ],
      },
      {
        name: "Emily Chen",
        role: "Assistant Chair",
        image: "emily-chen.jpg",
        experiences: ["Delegate of UNDP 2021", "Best Position Paper"],
      },
    ],
  },
  {
    slug: "who",
    delegate: "Single",
    name: "WHO",
    fullname: "World Health Organization",
    src: "who.webp",
    logo: "WHO.webp",
    quote: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    chairs: [
      {
        name: "lebron",
        role: "yg punya lakers",
        image: "olivia-davis-1.jpg",
        experiences: ["goated", "Best Delegate", "Chair of WHO in ABCMUN 2023", "Best Delegate"],
      },
      {
        name: "lebron",
        role: "yg punya lakers",
        image: "olivia-davis-1.jpg",
        experiences: ["goated", "Best Delegate", "Chair of WHO in ABCMUN 2023", "Best Delegate"],
      },
    ],
  },
  {
    slug: "ecofin",
    delegate: "Single",
    name: "ECOFIN",
    fullname: "Economic and Financial Committee",
    src: "ecofin.webp",
    logo: "ECOFIN.webp",
    quote: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    chairs: [
      {
        name: "lebron",
        role: "yg punya lakers",
        image: "olivia-davis-1.jpg",
        experiences: ["goated", "Best Delegate", "Chair of WHO in ABCMUN 2023", "Best Delegate"],
      },
      {
        name: "lebron",
        role: "yg punya lakers",
        image: "olivia-davis-1.jpg",
        experiences: ["goated", "Best Delegate", "Chair of WHO in ABCMUN 2023", "Best Delegate"],
      },
    ],
  },
  {
    slug: "unsc",
    delegate: "Double",
    name: "UNSC",
    fullname: "United Nations Security Council",
    src: "unsc.webp",
    logo: "UN.webp",
    quote: "Reviving Collective Security: Refroming the UNSC to Address Modern Threats",
    description:
      "The UNSC is responsible for maintaining international peace and security. It has the authority to impose sanctions, authorize military action, and establish peacekeeping missions.",
    chairs: [
      {
        name: "lebron",
        role: "yg punya lakers",
        image: "olivia-davis-1.jpg",
        experiences: ["goated", "Best Delegate", "Chair of WHO in ABCMUN 2023", "Best Delegate"],
      },
      {
        name: "lebron",
        role: "yg punya lakers",
        image: "olivia-davis-1.jpg",
        experiences: ["goated", "Best Delegate", "Chair of WHO in ABCMUN 2023", "Best Delegate"],
      },
    ],
  },
  {
    slug: "crisis",
    delegate: "Single",
    name: "Crisis",
    fullname: "Crisis Council",
    src: "crisis.webp",
    logo: "UN.webp",
    quote: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    chairs: [
      {
        name: "lebron",
        role: "yg punya lakers",
        image: "olivia-davis-1.jpg",
        experiences: ["goated", "Best Delegate", "Chair of WHO in ABCMUN 2023", "Best Delegate"],
      },
      {
        name: "lebron",
        role: "yg punya lakers",
        image: "olivia-davis-1.jpg",
        experiences: ["goated", "Best Delegate", "Chair of WHO in ABCMUN 2023", "Best Delegate"],
      },
    ],
  },
  {
    slug: "brics",
    delegate: "Double",
    name: "BRICS+",
    fullname: "BRICS+",
    src: "brics.webp",
    logo: "BRICS+.webp",
    quote: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    chairs: [
      {
        name: "lebron",
        role: "yg punya lakers",
        image: "olivia-davis-1.jpg",
        experiences: ["goated", "Best Delegate", "Chair of WHO in ABCMUN 2023", "Best Delegate"],
      },
      {
        name: "lebron",
        role: "yg punya lakers",
        image: "olivia-davis-1.jpg",
        experiences: ["goated", "Best Delegate", "Chair of WHO in ABCMUN 2023", "Best Delegate"],
      },
    ],
  },
  {
    slug: "press",
    delegate: "Single",
    name: "Press",
    fullname: "Press",
    src: "press.webp",
    logo: "UN.webp",
    quote: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    chairs: [
      {
        name: "lebron",
        role: "yg punya lakers",
        image: "olivia-davis-1.jpg",
        experiences: ["goated", "Best Delegate", "Chair of WHO in ABCMUN 2023", "Best Delegate"],
      },
      {
        name: "lebron",
        role: "yg punya lakers",
        image: "olivia-davis-1.jpg",
        experiences: ["goated", "Best Delegate", "Chair of WHO in ABCMUN 2023", "Best Delegate"],
      },
    ],
  },
];
