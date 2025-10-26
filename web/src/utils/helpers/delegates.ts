export type DelegateOptions = "single" | "team" | "observer" | "advisor";

export type AccommodationOption = {
  price: string;
  label: string;
  description?: string;
};

export type TeamPackage = {
  name: string;
  delegateRange: string;
  nonAccommodation: AccommodationOption;
  accommodation: AccommodationOption;
  points: string[];
};

export type Package = {
  name: string;
  price: string;
  points: string[];
};

export type Delegate =
  | {
      // For single, observer, advisor
      name: string;
      type: "participant" | "companion";
      description: string;
      package: Package[];
    }
  | {
      // For team
      name: string;
      type: "participant" | "companion";
      description: string;
      package: TeamPackage[];
    };

export const DELEGATES: Record<DelegateOptions, Delegate> = {
  ["single"]: {
    name: "Single Delegate",
    type: "participant",
    description:
      "One delegate, one country. You'll be the only person representing your assigned country in the council.",
    package: [
      {
        name: "Accomodation",
        price: "50",
        points: [
          "Deluxe room for 2 nights",
          "Including breakfast",
          "Meals and coffe break",
        "Meeting room",
          "Transportation (Shuttle Bus)",
          "Access to opening ceremony",
          "Access to networking night",
          "Many more",
        ],
      },
      {
        name: "Non-Accommodation",
        price: "50",
        points: [
          "Meals and coffe break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Access to opening ceremony",
          "Access to networking night",
          "Many more",
        ],
      },
    ],
  },
  ["team"]: {
    name: "Delegation Team",
    type: "participant",
    description:
      "Two or more delegates for more affordable rates. Each delegate can select their own country and councils independently.",
    package: [
      {
        name: "Package A",
        delegateRange: "For 2-5 Delegates",
        nonAccommodation: {
          price: "50",
          label: "Non-Accommodation",
        },
        accommodation: {
          price: "50",
          label: "Accommodation",
          description: "Deluxe room for 2 nights, including breakfast",
        },
        points: [
          "Meals and coffe break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Access to opening ceremony",
          "Access to networking night",
          "Many more",
        ],
      },
      {
        name: "Package B",
        delegateRange: "For 6-8 Delegates",
        nonAccommodation: {
          price: "90",
          label: "Non-Accommodation",
        },
        accommodation: {
          price: "90",
          label: "Accommodation",
          description: "Deluxe room for 2 nights, including breakfast",
        },
        points: [
          "Meals and coffe break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Access to opening ceremony and networking night",
          "Many more",
        ],
      },
      {
        name: "Package C",
        delegateRange: "For 9-12 Delegates",
        nonAccommodation: {
          price: "90",
          label: "Non-Accommodation",
        },
        accommodation: {
          price: "90",
          label: "Accommodation",
          description: "Deluxe room for 2 nights, including breakfast",
        },
        points: [
          "Meals and coffe break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Access to opening ceremony",
          "Access to networking night",
          "Many more",
        ],
      },
      {
        name: "Package D",
        delegateRange: "For > 12 Delegates",
        nonAccommodation: {
          price: "90",
          label: "Non-Accommodation",
        },
        accommodation: {
          price: "90",
          label: "Accommodation",
          description: "Deluxe room for 2 nights, including breakfast",
        },
        points: [
          "Meals and coffe break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Access to opening ceremony",
          "Access to networking night",
          "Many more",
        ],
      },
    ],
  },
  ["observer"]: {
    name: "Observer",
    type: "companion",
    description:
      "One participant without a country assignment. You will observe the council and have access to participate in multiple selected councils.",
    package: [
      {
        name: "Accomodation",
        price: "50",
        points: [
          "Deluxe room for 2 nights",
          "Including breakfast",
          "Meals and coffe break",
          "Meeting room",
          "Many more",
        ],
      },
      {
        name: "Non-Accommodation",
        price: "50",
        points: ["Meals and coffe break", "Meeting room", "Many more"],
      },
    ],
  },
  ["advisor"]: {
    name: "Faculty Advisor",
    type: "companion",
    description:
      "You will accompany and support your delegation team throughout the event, providing guidance and assistance as needed.",
    package: [
      {
        name: "Accomodation",
        price: "50",
        points: [
          "Deluxe room for 2 nights",
          "Including breakfast",
          "Transportation (Shuttle Bus)",
          "Many more",
        ],
      },
      {
        name: "Non-Accommodation",
        price: "50",
        points: ["Transportation (Shuttle Bus)", "Many more"],
      },
    ],
  },
};
