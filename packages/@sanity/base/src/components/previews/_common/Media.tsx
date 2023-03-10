import {Text} from '@sanity/ui'
import React, {isValidElement} from 'react'
import {PreviewMediaDimensions, PreviewLayoutKey, PreviewProps} from '../types'
import {MediaWrapper} from './Media.styled'

export interface MediaProps {
  border?: boolean
  dimensions: PreviewMediaDimensions
  layout: PreviewLayoutKey
  media: PreviewProps['media']
  radius?: number
  responsive?: boolean
  styles?: {
    media?: string
    mediaString?: string
  }
}

export function Media(props: MediaProps) {
  const {border = true, dimensions, layout, media, radius = 2, responsive = false, styles} = props

  return (
    <MediaWrapper
      $dimensions={dimensions}
      $layout={layout}
      $radius={radius}
      $responsive={responsive}
      className={styles?.media}
      data-testid="Media"
    >
      {renderMedia({dimensions, layout, media})}
      {border && <span />}
    </MediaWrapper>
  )
}

function renderMedia(props: {
  dimensions: PreviewMediaDimensions
  layout: PreviewLayoutKey
  media: PreviewProps['media']
  styles?: {
    media?: string
    mediaString?: string
  }
}) {
  const {dimensions, layout, media, styles} = props

  if (typeof media === 'function') {
    return media({dimensions, layout})
  }

  if (typeof media === 'string') {
    return (
      <Text as="span" className={styles?.mediaString}>
        {media}
      </Text>
    )
  }

  if (isValidElement(media)) {
    return media
  }

  return null
}
