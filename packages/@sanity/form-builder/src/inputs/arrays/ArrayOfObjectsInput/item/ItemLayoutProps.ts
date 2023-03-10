import {Marker, SchemaType} from '@sanity/types'
import React from 'react'
import {FormFieldPresence} from '@sanity/base/presence'
import {InsertEvent} from '../types'

export interface ItemLayoutProps {
  isSortable: boolean
  readOnly: boolean
  index: number
  value: {_key?: string; _ref?: string}
  type?: SchemaType // note: type might be undefined here if the value doesn't have a matching schema type definition
  insertableTypes?: SchemaType[]
  onClick?: () => void
  onFocus?: (event: React.FocusEvent) => void
  onRemove: () => void
  onInsert?: (event: InsertEvent) => void
  onKeyPress: (event: React.KeyboardEvent<any>) => void
  presence: FormFieldPresence[]
  validation: Marker[]
}
