// Checklist:
// Early Bird:
// - Single Delegate: Done
// - Team Delegation: Done
// - Observer: Done
// - Faculty Advisor: Done
// Regular:
// - Single Delegate:
// - Team Delegation:
// - Observer:
// - Faculty Advisor:
// Late:
// - Single Delegate:
// - Team Delegation:
// - Observer:
// - Faculty Advisor:

export const pricePackage = {
  single_delegate: {
    EarlyBird: {
      nonAccommodation: {
        label: "Non-Accommodation",
        price: {
          usd: "120",
          idr: "1.450.000",
        },
        description: "Without accommodation",
      },
      accommodation: {
        label: "With Accommodation",
        price: {
          usd: "170",
          idr: "2.250.000",
        },
        description: "Deluxe shared room for 2 nights, including breakfast",
      },
      points: [
        "Meals and coffee break",
        "Meeting room",
        "Transportation (Shuttle Bus)",
        "Access to opening ceremony",
        "Access to networking night",
        "Many more",
      ],
    },
    Regular: {
      nonAccommodation: {
        label: "Non-Accommodation",
        price: {
          usd: "130",
          idr: "1.550.000",
        },
        description: "Without accommodation",
      },
      accommodation: {
        label: "With Accommodation",
        price: {
          usd: "180",
          idr: "2.450.000",
        },
        description: "Deluxe shared room for 2 nights, including breakfast",
      },
      points: [
        "Meals and coffee break",
        "Meeting room",
        "Transportation (Shuttle Bus)",
        "Access to opening ceremony",
        "Access to networking night",
        "Many more",
      ],
    },
    Late: {
      nonAccommodation: {
        label: "Non-Accommodation",
        price: {
          usd: "140",
          idr: "1.650.000",
        },
        description: "Without accommodation",
      },
      accommodation: {
        label: "With Accommodation",
        price: {
          usd: "190",
          idr: "2.550.000",
        },
        description: "Deluxe shared room for 2 nights, including breakfast",
      },
      points: [
        "Meals and coffee break",
        "Meeting room",
        "Transportation (Shuttle Bus)",
        "Access to opening ceremony",
        "Access to networking night",
        "Many more",
      ],
    },
  },
  team_delegate: {
    EarlyBird: {
      packageA: {
        delegateRange: "For 2-5 Delegates",
        nonAccommodation: {
          label: "Non-Accommodation",
          price: {
            usd: "118",
            idr: "1.400.000",
          },
          description: "Per delegate",
        },
        accommodation: {
          label: "With Accommodation",
          price: {
            usd: "168",
            idr: "2.200.000",
          },
          description: "Deluxe shared room for 2 nights, including breakfast",
        },
        points: [
          "Meals and coffee break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Access to opening ceremony",
          "Access to awarding ceremony",
          "Access to networking night",
          "Many more",
        ],
      },
      packageB: {
        delegateRange: "For 6-8 Delegates",
        nonAccommodation: {
          label: "Non-Accommodation",
          price: {
            usd: "116",
            idr: "1.350.000",
          },
          description: "Per delegate",
        },
        accommodation: {
          label: "With Accommodation",
          price: {
            usd: "166",
            idr: "2.150.000",
          },
          description: "Deluxe shared room for 2 nights, including breakfast",
        },
        points: [
          "Meals and coffee break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Access to opening ceremony",
          "Access to awarding ceremony",
          "Access to networking night",
          "Many more",
        ],
      },
      packageC: {
        delegateRange: "For 9-12 Delegates",
        nonAccommodation: {
          label: "Non-Accommodation",
          price: {
            usd: "114",
            idr: "1.300.000",
          },
          description: "Per delegate",
        },
        accommodation: {
          label: "With Accommodation",
          price: {
            usd: "164",
            idr: "2.100.000",
          },
          description: "Deluxe shared room for 2 nights, including breakfast",
        },
        points: [
          "Meals and coffee break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Access to opening ceremony",
          "Access to awarding ceremony",
          "Access to networking night",
          "Many more",
        ],
      },
      packageD: {
        delegateRange: "For > 12 Delegates",
        nonAccommodation: {
          label: "Non-Accommodation",
          price: {
            usd: "112",
            idr: "1.250.000",
          },
          description: "Per delegate",
        },
        accommodation: {
          label: "With Accommodation",
          price: {
            usd: "162",
            idr: "2.050.000",
          },
          description: "Deluxe shared room for 2 nights, including breakfast",
        },
        points: [
          "Meals and coffee break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Access to opening ceremony",
          "Access to awarding ceremony",
          "Access to networking night",
          "Many more",
        ],
      },
    },
    Regular: {
      packageA: {
        delegateRange: "For 2-5 Delegates",
        nonAccommodation: {
          label: "Non-Accommodation",
          price: {
            usd: "128",
            idr: "1.500.000",
          },
          description: "Per delegate",
        },
        accommodation: {
          label: "With Accommodation",
          price: {
            usd: "178",
            idr: "2.400.000",
          },
          description: "Deluxe shared room for 2 nights, including breakfast",
        },
        points: [
          "Meals and coffee break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Access to opening ceremony",
          "Access to awarding ceremony",
          "Access to networking night",
          "Many more",
        ],
      },
      packageB: {
        delegateRange: "For 6-8 Delegates",
        nonAccommodation: {
          label: "Non-Accommodation",
          price: {
            usd: "128",
            idr: "1.500.000",
          },
          description: "Per delegate",
        },
        accommodation: {
          label: "With Accommodation",
          price: {
            usd: "176",
            idr: "2.350.000",
          },
          description: "Deluxe shared room for 2 nights, including breakfast",
        },
        points: [
          "Meals and coffee break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Access to opening ceremony and networking night",
          "Many more",
        ],
      },
      packageC: {
        delegateRange: "For 9-12 Delegates",
        nonAccommodation: {
          label: "Non-Accommodation",
          price: {
            usd: "124",
            idr: "1.400.000",
          },
          description: "Per delegate",
        },
        accommodation: {
          label: "With Accommodation",
          price: {
            usd: "174",
            idr: "2.300.000",
          },
          description: "Deluxe shared room for 2 nights, including breakfast",
        },
        points: [
          "Meals and coffee break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Access to opening ceremony",
          "Access to awarding ceremony",
          "Access to networking night",
          "Many more",
        ],
      },
      packageD: {
        delegateRange: "For > 12 Delegates",
        nonAccommodation: {
          label: "Non-Accommodation",
          price: {
            usd: "122",
            idr: "1.350.000",
          },
          description: "Per delegate",
        },
        accommodation: {
          label: "With Accommodation",
          price: {
            usd: "172",
            idr: "2.250.000",
          },
          description: "Deluxe shared room for 2 nights, including breakfast",
        },
        points: [
          "Meals and coffee break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Access to opening ceremony",
          "Access to awarding ceremony",
          "Access to networking night",
          "Many more",
        ],
      },
    },
    Late: {
      packageA: {
        delegateRange: "For 2-5 Delegates",
        nonAccommodation: {
          label: "Non-Accommodation",
          price: {
            usd: "138",
            idr: "1.600.000",
          },
          description: "Per delegate",
        },
        accommodation: {
          label: "With Accommodation",
          price: {
            usd: "188",
            idr: "2.400.000",
          },
          description: "Deluxe shared room for 2 nights, including breakfast",
        },
        points: [
          "Meals and coffee break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Access to opening ceremony",
          "Access to awarding ceremony",
          "Access to networking night",
          "Many more",
        ],
      },
      packageB: {
        delegateRange: "For 6-8 Delegates",
        nonAccommodation: {
          label: "Non-Accommodation",
          price: {
            usd: "136",
            idr: "1.550.000",
          },
          description: "Per delegate",
        },
        accommodation: {
          label: "With Accommodation",
          price: {
            usd: "186",
            idr: "2.350.000",
          },
          description: "Deluxe shared room for 2 nights, including breakfast",
        },
        points: [
          "Meals and coffee break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Access to opening ceremony and networking night",
          "Many more",
        ],
      },
      packageC: {
        delegateRange: "For 9-12 Delegates",
        nonAccommodation: {
          label: "Non-Accommodation",
          price: {
            usd: "134",
            idr: "1.500.000",
          },
          description: "Per delegate",
        },
        accommodation: {
          label: "With Accommodation",
          price: {
            usd: "184",
            idr: "2.300.000",
          },
          description: "Deluxe shared room for 2 nights, including breakfast",
        },
        points: [
          "Meals and coffee break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Access to opening ceremony",
          "Access to awarding ceremony",
          "Access to networking night",
          "Many more",
        ],
      },
      packageD: {
        delegateRange: "For > 12 Delegates",
        nonAccommodation: {
          label: "Non-Accommodation",
          price: {
            usd: "132",
            idr: "1.450.000",
          },
          description: "Per delegate",
        },
        accommodation: {
          label: "With Accommodation",
          price: {
            usd: "182",
            idr: "2.250.000",
          },
          description: "Deluxe shared room for 2 nights, including breakfast",
        },
        points: [
          "Meals and coffee break",
          "Meeting room",
          "Transportation (Shuttle Bus)",
          "Access to opening ceremony",
          "Access to awarding ceremony",
          "Access to networking night",
          "Many more",
        ],
      },
    },
  },
  observer: {
    EarlyBird: {
      nonAccommodation: {
        label: "Non-Accommodation",
        price: {
          usd: "90",
          idr: "950.000",
        },
        description: "Without accommodation",
      },
      accommodation: {
        label: "With Accommodation",
        price: {
          usd: "140",
          idr: "1.750.000",
        },
        description: "Deluxe shared room for 2 nights, including breakfast",
      },
      points: [
        "Meals and coffee break",
        "Meeting room",
        "Access to opening ceremony",
        "Access to awarding ceremony",
        "Transportation (Shuttle Bus)",
        "Many more",
      ],
    },
    Regular: {
      nonAccommodation: {
        label: "Non-Accommodation",
        price: {
          usd: "100",
          idr: "1.050.000",
        },
        description: "Without accommodation",
      },
      accommodation: {
        label: "With Accommodation",
        price: {
          usd: "150",
          idr: "1.850.000",
        },
        description: "Deluxe shared room for 2 nights, including breakfast",
      },
      points: [
        "Meals and coffee break",
        "Meeting room",
        "Access to opening ceremony",
        "Access to awarding ceremony",
        "Transportation (Shuttle Bus)",
        "Many more",
      ],
    },
    Late: {
      nonAccommodation: {
        label: "Non-Accommodation",
        price: {
          usd: "110",
          idr: "1.150.000",
        },
        description: "Without accommodation",
      },
      accommodation: {
        label: "With Accommodation",
        price: {
          usd: "160",
          idr: "1.950.000",
        },
        description: "Deluxe shared room for 2 nights, including breakfast",
      },
      points: [
        "Meals and coffee break",
        "Meeting room",
        "Access to opening ceremony",
        "Access to awarding ceremony",
        "Transportation (Shuttle Bus)",
        "Many more",
      ],
    },
  },
  advisor: {
    EarlyBird: {
      nonAccommodation: {
        label: "Non-Accommodation",
        price: {
          usd: "80",
          idr: "750.000",
        },
        description: "Without accommodation",
      },
      accommodation: {
        label: "With Accommodation",
        price: {
          usd: "120",
          idr: "1.450.000",
        },
        description: "Deluxe shared room for 2 nights, including breakfast",
      },
      points: [
        "Access to opening ceremony",
        "Access to awarding ceremony",
        "Transportation (Shuttle Bus)",
        "Many more",
      ],
    },
    Regular: {
      nonAccommodation: {
        label: "Non-Accommodation",
        price: {
          usd: "90",
          idr: "850.000",
        },
        description: "Without accommodation",
      },
      accommodation: {
        label: "With Accommodation",
        price: {
          usd: "130",
          idr: "1.550.000",
        },
        description: "Deluxe shared room for 2 nights, including breakfast",
      },
      points: [
        "Access to opening ceremony",
        "Access to awarding ceremony",
        "Transportation (Shuttle Bus)",
        "Many more",
      ],
    },
    Late: {
      nonAccommodation: {
        label: "Non-Accommodation",
        price: {
          usd: "100",
          idr: "950.000",
        },
        description: "Without accommodation",
      },
      accommodation: {
        label: "With Accommodation",
        price: {
          usd: "140",
          idr: "1.650.000",
        },
        description: "Deluxe shared room for 2 nights, including breakfast",
      },
      points: [
        "Access to opening ceremony",
        "Access to awarding ceremony",
        "Transportation (Shuttle Bus)",
        "Many more",
      ],
    },
  },
};
