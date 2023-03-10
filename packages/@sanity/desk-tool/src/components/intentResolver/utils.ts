// @todo: remove the following line when part imports has been removed from this file
///<reference types="@sanity/types/parts" />
import {getPublishedId} from 'part:@sanity/base/util/draft-utils'
import documentStore from 'part:@sanity/base/datastore/document'
import {uuid} from '@sanity/uuid'
import {first} from 'rxjs/operators'
import {Observable} from 'rxjs'
import {PaneResolutionError} from '../../utils/PaneResolutionError'

export function removeDraftPrefix(documentId: string): string {
  const publishedId = getPublishedId(documentId)

  if (publishedId !== documentId) {
    console.warn(
      'Removed unexpected draft id in document link: All links to documents should have the ' +
        '`drafts.`-prefix removed and something appears to have made an intent link to `%s`',
      documentId
    )
  }

  return publishedId
}

export async function ensureDocumentIdAndType(
  id: string | undefined,
  type: string | undefined
): Promise<{id: string; type: string}> {
  if (id && type) return {id, type}
  if (!id && type) return {id: uuid(), type}
  if (id && !type) {
    const resolvedType = await (documentStore.resolveTypeForDocument(id) as Observable<string>)
      .pipe(first())
      .toPromise()

    return {id, type: resolvedType}
  }

  throw new PaneResolutionError({
    message: 'Neither document `id` or `type` was provided when trying to resolve intent.',
  })
}
