import {UserIcon, MoonIcon, BookIcon} from '@sanity/icons'

export const crossDatasetSubtype = {
  type: 'crossDatasetReference',
  name: 'crossDatasetSubtype',
  title: 'Subtype of cross dataset references',
  dataset: 'playground',
  projectId: 'ppsg7ml5',
  to: [
    {
      type: 'book',
      icon: BookIcon,
      // eslint-disable-next-line camelcase
      __experimental_search: [{path: ['title'], weight: 10}],
      preview: {
        select: {
          title: 'title',
          media: 'coverImage',
        },
        prepare(val) {
          return {
            title: val.title,
            media: val.coverImage,
          }
        },
      },
    },
  ],
}

export default {
  name: 'crossDatasetReferenceTest',
  type: 'document',
  title: 'Cross dataset reference test',
  description: 'Test cases for cross dataset references',
  icon: MoonIcon,
  fields: [
    {name: 'title', type: 'string'},
    {
      name: 'bookInPlayground',
      title: 'Reference to book or author in the "playground" dataset in project "ppsg7ml5"',
      description:
        "Note: The current token for the dataset does not have read access to documents in the 'restricted.**' path",
      type: 'crossDatasetReference',
      dataset: 'playground',
      projectId: 'ppsg7ml5',
      tokenId: 'restricted',
      studioUrl: ({id, type}) => {
        return type
          ? `${document.location.protocol}//${document.location.host}/playground/desk/${type};${id}`
          : null
      },
      to: [
        {
          type: 'book',
          icon: BookIcon,
          // eslint-disable-next-line camelcase
          __experimental_search: [{path: 'title', weight: 10}],
          preview: {
            select: {
              title: 'title',
              media: 'coverImage',
            },
            prepare(val) {
              return {
                title: val.title,
                media: val.coverImage,
              }
            },
          },
        },
      ],
    },
    {
      title: 'Reference to book or author in the "playground" dataset in project "ppsg7ml5"',
      name: 'bookOrAuthorInPlayground',
      type: 'crossDatasetReference',
      dataset: 'playground',
      projectId: 'ppsg7ml5',
      tokenId: 'readToken',
      studioUrl: ({id, type}) => {
        return type
          ? `${document.location.protocol}//${document.location.host}/playground/desk/${type};${id}`
          : null
      },
      to: [
        {
          type: 'book',
          icon: BookIcon,
          // eslint-disable-next-line camelcase
          __experimental_search: [{path: 'title', weight: 10}],
          preview: {
            select: {
              title: 'title',
              coverImage: 'coverImage',
            },
            prepare(val) {
              return {
                title: val.title,
                media: val.coverImage,
              }
            },
          },
        },
        {
          type: 'author',
          icon: UserIcon,
          // eslint-disable-next-line camelcase
          __experimental_search: [{path: 'name', weight: 10}],
          preview: {
            select: {
              name: 'name',
            },
            prepare(val) {
              return {
                title: val.name,
                media: val.media,
              }
            },
          },
        },
      ],
    },
    {
      title: 'Article in docs dataset',
      name: 'docsArticle',
      type: 'crossDatasetReference',
      dataset: 'next',
      projectId: '3do82whm',
      studioUrl: ({id, type}) => {
        return type ? `https://admin.sanity.io/desk/docs;${type};${id}` : null
      },
      to: [
        {
          type: 'article',
          icon: BookIcon,
          // eslint-disable-next-line camelcase
          __experimental_search: [{path: 'title', weight: 10}],
          preview: {
            select: {
              title: 'title',
            },
          },
        },
      ],
    },
    {
      title: 'Cross Dataset reference in PTE',
      name: 'portableText',
      type: 'array',
      of: [
        {type: 'block'},
        {
          title: 'Cross Dataset reference subtype test',
          name: 'crossDatasetSubtype',
          type: 'crossDatasetSubtype',
        },
        {
          type: 'crossDatasetReference',
          dataset: 'next',
          projectId: '3do82whm',
          studioUrl: ({id, type}) => {
            return type ? `https://admin.sanity.io/desk/docs;${type};${id}` : null
          },
          title: 'Cross dataset reference to docs article in admin.sanity.io',
          to: [
            {
              type: 'article',
              icon: BookIcon,
              // eslint-disable-next-line camelcase
              __experimental_search: [{path: 'title', weight: 10}],
              preview: {
                select: {
                  title: 'title',
                },
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Cross Dataset reference in array',
      name: 'array',
      type: 'array',
      of: [
        {
          title: 'Cross Dataset reference subtype test',
          name: 'crossDatasetSubtype',
          type: 'crossDatasetSubtype',
        },
        {
          type: 'crossDatasetReference',
          dataset: 'next',
          projectId: '3do82whm',
          studioUrl: ({id, type}) => {
            return type ? `https://admin.sanity.io/desk/docs;${type};${id}` : null
          },
          title: 'Cross dataset reference to docs article in admin.sanity.io',
          to: [
            {
              type: 'article',
              icon: BookIcon,
              // eslint-disable-next-line camelcase
              __experimental_search: [{path: 'title', weight: 10}],
              preview: {
                select: {
                  title: 'title',
                },
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Cross Dataset reference subtype test',
      name: 'crossDatasetSubtype',
      type: 'crossDatasetSubtype',
    },
  ],
  preview: {
    select: {
      title: 'title',
      authorRefName: 'bookOrAuthorInPlayground.name',
      authorBff: 'bookOrAuthorInPlayground.bestFriend.name',
      bookRefTitle: 'bookOrAuthorInPlayground.title',
    },
    prepare(values) {
      return {
        title: values.title,
        subtitle: [
          values.authorRefName
            ? `Author: ${values.authorRefName} (${`Bff: ${values.authorBff || 'none'}`})`
            : '',
          values.bookRefTitle ? `Book title: ${values.bookRefTitle}` : '',
        ]
          .filter(Boolean)
          .join(', '),
      }
    },
  },
}
