import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    description: 'Create and edit article pages.'
  },
  auth: true,
  upload: true,
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        placeholder: "Your Title Here",
        width: '60%'
      }
    },
    {
      type: "row",
      fields: [
        {
          name: "author",
          type: "text",
          required: true,
          admin: {
            placeholder: "John Doe",
            width: '50%'
          }
        },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          admin: {
            placeholder: "your-title-here",
            description: "A slug is the URL-Friendly version of the corresponding title. For example, a title of 'Yogyakarta International' would have a slug of 'yogyakarta-international'.",
            width: '50%'
          },
        }
      ]
    },
    {
      name: "image",
      type: "upload",
      relationTo: 'media',
      required: true,
      filterOptions: {
        mimeType: { contains: 'image' }
      },
      admin: {
        
        description: "The header image for this specific page. Shown on the top of every article page."
      }
    },
    {
      name: "content",
      type: "richText",
      required: true,
      admin: {
        description: "Write the contents of your article here in markdown format."
      }
    }
  ],
}
