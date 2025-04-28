export type PriceOptions = "single" | "double" | "team" | "observer" | "advisor";

export const PRICES = {
  ["single"]: {
    name: "Single Delegates",
    description:
      "One delegate, one country. You'll be the only person representing your assigned country in the council.",
    package: [
      {
        name: "Accomodation",
        price: 50,
        points: ["List item", "List item", "List item"],
      },
      {
        name: "Non-Accommodation",
        price: 50,
        points: ["List item", "List item", "List item"],
      },
    ],
  },
  ["double"]: {
    name: "Double Delegates",
    description:
      "Two delegates, one country. You and a partner will represent the same country in the council.",
    package: [],
  },
  ["team"]: {
    name: "Team Delegates",
    description:
      "Three or more delegates, one country. You and your team will represent the same country in the council.",
    package: [],
  },
  ["observer"]: {
    name: "Observer Delegates",
    description:
      "One delegate, no country. You will be an observer in the council, without a specific country assignment.",
    package: [],
  },
  ["advisor"]: {
    name: "Advisor Delegates",
    description:
      "One advisor, no country. You will be an advisor in the council, without a specific country assignment.",
    package: [],
  },
};
