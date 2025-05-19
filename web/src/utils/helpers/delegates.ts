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

export type Delegate =
  | {
      // For single, observer, advisor
      name: string;
      type: 'participant' | 'companion';
      description: string;
      package: {
        name: string;
        price: string;
        points: string[];
      }[];
    }
  | {
      // For team
      name: string;
      description: string;
      package: TeamPackage[];
    };

export const DELEGATES: Record<DelegateOptions, Delegate> = {
  ["single"]: {
    name: "Single Delegates",
    type: 'participant',
    description:
      "One delegate, one country. You'll be the only person representing your assigned country in the council.",
    package: [
      {
        name: "Accomodation",
        price: "50",
        points: [
          "Deluxe single room for 2 nights",
          "Meals and coffe break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
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
          "Many more",
        ],
      },
    ],
  },
  ["team"]: {
    name: "Delegation Team",
    type: 'participant',
    description: "Two or more delegates, one country.",
    package: [
      {
        name: "Package A",
        delegateRange: "For 1-3 Delegates",
        nonAccommodation: {
          price: "50",
          label: "Non-Accommodation",
        },
        accommodation: {
          price: "50",
          label: "Accommodation",
          description: "Deluxe single room for 2 nights",
        },
        points: [
          "Meals and coffe break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Many more",
        ],
      },
      {
        name: "Package B",
        delegateRange: "For 4-7 Delegates",
        nonAccommodation: {
          price: "90",
          label: "Non-Accommodation",
        },
        accommodation: {
          price: "90",
          label: "Accommodation",
          description: "Deluxe single room for 2 nights",
        },
        points: [
          "Meals and coffe break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Many more",
        ],
      },
      {
        name: "Package C",
        delegateRange: "For 8-12 Delegates",
        nonAccommodation: {
          price: "90",
          label: "Non-Accommodation",
        },
        accommodation: {
          price: "90",
          label: "Accommodation",
          description: "Deluxe single room for 2 nights",
        },
        points: [
          "Meals and coffe break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
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
          description: "Deluxe single room for 2 nights",
        },
        points: [
          "Meals and coffe break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Many more",
        ],
      },
    ],
  },
  ["observer"]: {
    name: "Observer",
    type: 'companion',
    description:
      "One delegate, no country. You will be an observer in the council, without a specific country assignment.",
    package: [
      {
        name: "Accomodation",
        price: "50",
        points: [
          "Deluxe single room for 2 nights",
          "Meals and coffe break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
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
          "Many more",
        ],
      },
    ],
  },
  ["advisor"]: {
    name: "Faculty Advisor",
    type: 'companion',
    description:
      "One advisor, no country. You will be an advisor in the council, without a specific country assignment.",
    package: [
      {
        name: "Accomodation",
        price: "50",
        points: [
          "Deluxe single room for 2 nights",
          "Meals and coffe break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
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
          "Many more",
        ],
      },
    ],
  },
};