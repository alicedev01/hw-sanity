// @todo: remove the following line when part imports has been removed from this file
///<reference types="@sanity/types/parts" />

import Schema from '@sanity/schema'
import legacyRichDate from 'part:@sanity/form-builder/input/legacy-date/schema?'
import {validateSchema, groupProblems} from '@sanity/schema/_internal'
// eslint-disable-next-line import/no-unresolved
import {inferFromSchema as inferValidation} from '@sanity/validation'
import slug from './types/slug'
import geopoint from './types/geopoint'
import imageCrop from './types/imageCrop'
import imageHotspot from './types/imageHotspot'
import assetSourceData from './types/assetSourceData'
import imageAsset from './types/imageAsset'
import imagePalette from './types/imagePalette'
import imagePaletteSwatch from './types/imagePaletteSwatch'
import imageDimensions from './types/imageDimensions'
import imageMetadata from './types/imageMetadata'
import fileAsset from './types/fileAsset'

const isError = (problem) => problem.severity === 'error'

module.exports = (schemaDef) => {
  const validated = validateSchema(schemaDef.types).getTypes()

  const validation = groupProblems(validated)
  const hasErrors = validation.some((group) => group.problems.some(isError))

  let types = []
  if (!hasErrors) {
    types = [
      ...schemaDef.types,
      assetSourceData,
      slug,
      geopoint,
      legacyRichDate,
      imageAsset,
      fileAsset,
      imageCrop,
      imageHotspot,
      imageMetadata,
      imageDimensions,
      imagePalette,
      imagePaletteSwatch,
    ].filter(Boolean)
  }

  const compiled = Schema.compile({
    name: schemaDef.name,
    types,
  })

  ;(compiled as any)._source = schemaDef
  ;(compiled as any)._validation = validation

  return inferValidation(compiled)
}
