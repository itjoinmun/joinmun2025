import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    group: "Content",
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (!data) return;
        // Auto-generate slug from title when creating or updating if slug not provided
        const hasTitle = typeof data.title === "string" && data.title.trim().length > 0;
        const hasSlug = typeof data.slug === "string" && data.slug.trim().length > 0;
        if (hasTitle && !hasSlug) {
          data.slug = generateSlug(data.title as string);
        }
      },
    ],
  },
  fields: [
    {
      type: "group",
      admin: {
        position: "sidebar",
      },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          admin: {
            placeholder: "Your Title Here",
          },
        },
        {
          name: "slug",
          type: "text",
          unique: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: "media",
          type: "relationship",
          relationTo: "media-publishers",
          required: true,
        },
        {
          name: "published",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      filterOptions: {
        mimeType: { contains: "image" },
      },
      admin: {
        description:
          "The header image for this specific page. Shown on the top of every article page.",
      },
    },
    {
      name: "description",
      type: "textarea",
      required: false,
      maxLength: 50,
      admin: {
        placeholder: "A short description of the article",
        description: "Shown on the article card, max 50 characters.",
      },
    },
    {
      name: "content",
      type: "richText",
      required: true,
      editor: lexicalEditor({
        admin: {
          placeholder: "Start writing your article here",
        },
      }),
    },
  ],
};
