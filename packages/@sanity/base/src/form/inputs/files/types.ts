import imageUrlBuilder from '@sanity/image-url'

// todo: see if we can get the ImageUrlBuilder type directly from @sanity/image-url instead of having to use this ReturnType workaround
export type ImageUrlBuilder = ReturnType<typeof imageUrlBuilder>

export interface UploadState {
  progress: number
  initiated: string
  updated: string
  file: {name: string; type: string}
}