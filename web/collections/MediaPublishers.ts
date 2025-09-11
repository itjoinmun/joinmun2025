import { CollectionConfig } from "payload";

export const MediaPublishers: CollectionConfig = {
  slug: "media-publishers",
  admin: {
    useAsTitle: "name",
    group: "Content",
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
          admin: {
            placeholder: "Publisher Name",
            width: "50%",
          },
        },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          admin: {
            placeholder: "publisher-name",
            description:
              "A slug is the URL-Friendly version of the corresponding title. For example, a title of 'Yogyakarta International' would have a slug of 'yogyakarta-international'.",
            width: "50%",
          },
        },
      ],
    },
  ],
};
