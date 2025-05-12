export type PriceOptions = "single" | "team" | "observer" | "advisor";

export type PriceOptionType = {
  name: string;
  description: string;
  package: {
    name: string;
    price: number;
    points: string[];
  }[];
};

export const PRICES: Record<PriceOptions, PriceOptionType> = {
  ["single"]: {
    name: "Single Delegates",
    description:
      "One delegate, one country. You'll be the only person representing your assigned country in the council.",
    package: [
      {
        name: "Accomodation",
        price: 50,
        points: ["List item", "List item"],
      },
      {
        name: "Non-Accommodation",
        price: 50,
        points: ["List item", "List item", "List item"],
      },
    ],
  },
  ["team"]: {
    name: "Delegation Team",
    description: "Two or more delegates, one country.",
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
  ["observer"]: {
    name: "Observer",
    description:
      "One delegate, no country. You will be an observer in the council, without a specific country assignment.",
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
  ["advisor"]: {
    name: "Faculty Advisor",
    description:
      "One advisor, no country. You will be an advisor in the council, without a specific country assignment.",
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
};
