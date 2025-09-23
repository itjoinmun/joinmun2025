import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    group: "Content",
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
          required: true,
          unique: true,
          admin: {
            placeholder: "your-title-here",
            description:
              "A slug is the URL-Friendly version of the corresponding title. For example, a title of 'Yogyakarta International' would have a slug of 'yogyakarta-international'.",
          },
        },
        {
          name: "author",
          type: "text",
          required: true,
          admin: {
            placeholder: "John Doe",
            width: "50%",
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
