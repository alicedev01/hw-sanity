import {SchemaType} from '@sanity/types'
import {EMPTY, of} from 'rxjs'
import imageUrlBuilder from '@sanity/image-url'
import React, {ComponentProps, useMemo} from 'react'
import {LayerProvider, studioTheme, ThemeProvider, ToastProvider} from '@sanity/ui'
import {StudioFormBuilderProvider} from '../../studio/StudioFormBuilderProvider'
import {FileInput} from '../../inputs/files/FileInput'

import type {UploadOptions} from '../../studio/uploads/types'
import {createPatchChannel} from '../../patch/PatchChannel'

const resolveUploaderStub = () => ({
  priority: 1,
  type: 'file',
  accepts: 'file/*',
  upload: (file: File, type?: SchemaType, options?: UploadOptions) => EMPTY,
})

const observeAssetStub = (id: string) =>
  of({
    originalFilename: 'cats.txt',
    url: 'https://cdn.sanity.io/files/ppsg7ml5/test/26db46ec62059d6cd491b4343afaecc92ff1b4d5.txt',
    size: 31,
    _id: 'file-26db46ec62059d6cd491b4343afaecc92ff1b4d5-txt',
    _rev: 'slQurnjRhOy7Fj3dkfUHei',
    _type: 'sanity.fileAsset',
  })

const imageUrlBuilderStub = imageUrlBuilder({dataset: 'some-dataset', projectId: 'some-project-id'})

export const DEFAULT_PROPS = {
  value: {},
  compareValue: {},
  type: {
    description: '',
    fields: [
      {
        name: 'asset',
        type: {
          fields: [],
          jsonType: 'object',
          name: 'reference',
          title: 'Reference to file',
          to: [],
          type: {name: 'reference', type: null, jsonType: 'object', validation: []},
          validation: [],
        },
      },
    ],
    isCustomized: false,
    jsonType: 'object',
    name: '',
    options: {},
    preview: {},
    title: '',
    type: {
      jsonType: 'object',
      name: 'file',
      type: null,
    },
  },
  level: 1,
  onChange: () => undefined,
  resolveUploader: resolveUploaderStub,
  observeAsset: observeAssetStub,
  onBlur: () => undefined,
  onFocus: () => undefined,
  readOnly: false,
  focusPath: [],
  directUploads: true,
  assetSources: [{}],
  validation: [],
  presence: [],
  imageUrlBuilder: imageUrlBuilderStub,
  path: ['file'],
}

// Use this in your test to get full control when testing the form builder
// the default props are available in DEFAULT_props
export const FileInputTester = React.forwardRef(function ImageInputTester(
  props: ComponentProps<typeof FileInput>
  // ref
) {
  const patchChannel = useMemo(() => createPatchChannel(), [])

  return (
    <ThemeProvider scheme="light" theme={studioTheme}>
      <LayerProvider>
        <ToastProvider>
          <StudioFormBuilderProvider
            __internal_patchChannel={patchChannel}
            onChange={() => undefined}
            value={undefined}
          >
            <FileInput {...props} />
          </StudioFormBuilderProvider>
        </ToastProvider>
      </LayerProvider>
    </ThemeProvider>
  )
})