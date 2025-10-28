import { CollectionConfig } from "payload";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const MediaPublishers: CollectionConfig = {
  slug: "media-publishers",
  admin: {
    useAsTitle: "name",
    group: "Content",
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return;
        const hasName = typeof data.name === "string" && data.name.trim().length > 0;
        const hasSlug = typeof data.slug === "string" && data.slug.trim().length > 0;
        if (hasName && !hasSlug) {
          data.slug = generateSlug(data.name as string);
        }
      },
    ],
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
          name: "author",
          type: "text",
          required: true,
          admin: {
            placeholder: "Author Name",
            description: "The name of the author of the articles published by this publisher.",
            width: "50%",
          },
        },
        {
          name: "slug",
          type: "text",
          unique: true,
          admin: {
            readOnly: true,
            width: "50%",
          },
        },
      ],
    },
  ],
};
