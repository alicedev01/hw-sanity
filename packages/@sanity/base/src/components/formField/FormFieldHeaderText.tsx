/* eslint-disable camelcase */

import {isValidationMarker, Marker} from '@sanity/types'
import {Box, Flex, Stack, Text} from '@sanity/ui'
import React, {memo, useMemo} from 'react'
import {FormFieldValidationStatus} from './FormFieldValidationStatus'

export interface FormFieldHeaderTextProps {
  /**
   * @beta
   */
  __unstable_markers?: Marker[]
  description?: React.ReactNode
  /**
   * The unique ID used to target the actual input element
   */
  inputId?: string
  title?: React.ReactNode
}

const EMPTY_ARRAY = []

export const FormFieldHeaderText = memo(function FormFieldHeaderText(
  props: FormFieldHeaderTextProps
) {
  const {description, inputId, title, __unstable_markers: markers = EMPTY_ARRAY} = props
  const validationMarkers = useMemo(() => markers.filter(isValidationMarker), [markers])
  const hasValidations = validationMarkers.length > 0

  return (
    <Stack space={2}>
      <Flex>
        <Text as="label" htmlFor={inputId} weight="semibold" size={1}>
          {title || <em>Untitled</em>}
        </Text>

        {hasValidations && (
          <Box marginLeft={2}>
            <FormFieldValidationStatus fontSize={1} __unstable_markers={markers} portal />
          </Box>
        )}
      </Flex>

      {description && (
        <Text muted size={1}>
          {description}
        </Text>
      )}
    </Stack>
  )
})
