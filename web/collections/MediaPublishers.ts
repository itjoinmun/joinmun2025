import { CollectionConfig } from "payload";

export const MediaPublishers: CollectionConfig = {
  slug: "media-publishers",
  admin: {
    useAsTitle: "name",
    description: "Create and edit media publisher profiles.",
    group: "Content",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: {
        placeholder: "Publisher Name",
      },
    },
  ],
};
