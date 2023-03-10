import {Box, Button, Text, Tooltip} from '@sanity/ui'
import React, {memo, useCallback} from 'react'
import {CopyIcon} from '@sanity/icons'
import {keyGenerator} from '@sanity/portable-text-editor'

const BlockActions = memo(function BlockActions(props: {block: any; insert: any}) {
  const {block, insert} = props

  const handleDuplicate = useCallback(() => {
    const dupBlock = {
      ...block,
      _key: keyGenerator(),
    }

    if (dupBlock.children) {
      dupBlock.children = dupBlock.children.map((c) => ({...c, _key: keyGenerator()}))
    }

    insert(dupBlock)
  }, [block, insert])

  return (
    <Tooltip
      content={
        <Box padding={2}>
          <Text size={1}>Duplicate</Text>
        </Box>
      }
      placement="right"
      portal="default"
    >
      <Button
        aria-label="Duplicate"
        fontSize={1}
        icon={CopyIcon}
        onClick={handleDuplicate}
        padding={2}
        mode="bleed"
      />
    </Tooltip>
  )
})

export function renderBlockActions({block, insert}) {
  return <BlockActions block={block} insert={insert} />
}
