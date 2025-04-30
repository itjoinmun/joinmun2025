export type Council = {
  slug: string;
  name: string;
  fullname: string;
  src: string;
  quote: string;
  description: string;
};

export const COUNCILS = [
  {
    slug: "un-women",
    name: "UN Women",
    fullname: "Equality and the Empwerment of Women",
    src: "UN Women.webp",
    quote: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    chairs: [
      {
        name: "Olivia Davis",
        role: "Head Chair",
        image: "olivia-davis-1.jpg",
        pastExperience: [
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
        pastExperience: [
          "Co-Chair of UNICEF 2022",
          "Outstanding Delegate",
          "Chair of UNHRC in UGM MUN 2023",
        ],
      },
      {
        name: "Emily Chen",
        role: "Assistant Chair",
        image: "emily-chen.jpg",
        pastExperience: ["Delegate of UNDP 2021", "Best Position Paper"],
      },
    ],
  },
  {
    slug: "who",
    name: "WHO",
    fullname: "World Health Organization",
    src: "WHO.webp",
    quote: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    chairs: [
      {
        name: "lebron",
        role: "yg punya lakers",
        image: "olivia-davis-1.jpg",
        pastExperience: ["goated", "Best Delegate", "Chair of WHO in ABCMUN 2023", "Best Delegate"],
      },
    ],
  },
  {
    slug: "ecofin",
    name: "ECOFIN",
    fullname: "Economic and Financial Committee",
    src: "ECOFIN.webp",
    quote: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    chairs: [
      {
        name: "lebron",
        role: "yg punya lakers",
        image: "olivia-davis-1.jpg",
        pastExperience: ["goated", "Best Delegate", "Chair of WHO in ABCMUN 2023", "Best Delegate"],
      },
    ],
  },
  {
    slug: "unsc",
    name: "UNSC",
    fullname: "United Nations Security Council",
    src: "UN.webp",
    quote: "Reviving Collective Security: Refroming the UNSC to Address Modern Threats",
    description:
      "The UNSC is responsible for maintaining international peace and security. It has the authority to impose sanctions, authorize military action, and establish peacekeeping missions.",
    chairs: [
      {
        name: "lebron",
        role: "yg punya lakers",
        image: "olivia-davis-1.jpg",
        pastExperience: ["goated", "Best Delegate", "Chair of WHO in ABCMUN 2023", "Best Delegate"],
      },
    ],
  },
  {
    slug: "crisis",
    name: "Crisis",
    fullname: "Crisis Council",
    src: "UN.webp",
    quote: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    chairs: [
      {
        name: "lebron",
        role: "yg punya lakers",
        image: "olivia-davis-1.jpg",
        pastExperience: ["goated", "Best Delegate", "Chair of WHO in ABCMUN 2023", "Best Delegate"],
      },
    ],
  },
  {
    slug: "brics",
    name: "BRICS+",
    fullname: "BRICS+",
    src: "BRICS+.webp",
    quote: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    chairs: [
      {
        name: "lebron",
        role: "yg punya lakers",
        image: "olivia-davis-1.jpg",
        pastExperience: ["goated", "Best Delegate", "Chair of WHO in ABCMUN 2023", "Best Delegate"],
      },
    ],
  },
  {
    slug: "press",
    name: "Press",
    fullname: "Press",
    src: "UN.webp",
    quote: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
    chairs: [
      {
        name: "lebron",
        role: "yg punya lakers",
        image: "olivia-davis-1.jpg",
        pastExperience: ["goated", "Best Delegate", "Chair of WHO in ABCMUN 2023", "Best Delegate"],
      },
    ],
  },
];
