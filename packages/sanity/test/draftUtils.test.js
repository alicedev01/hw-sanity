import {collate, removeDupes} from '../src/util/draftUtils'

test('collate()', () => {
  const foo = {_type: 'foo', _id: 'foo'}
  const fooDraft = {_type: 'foo', _id: 'drafts.foo'}
  const barDraft = {_type: 'foo', _id: 'drafts.bar'}
  const baz = {_type: 'foo', _id: 'baz'}

  expect(collate([foo, fooDraft, barDraft, baz])).toEqual([
    {type: 'foo', id: 'foo', draft: fooDraft, published: foo},
    {type: 'foo', id: 'bar', draft: barDraft},
    {type: 'foo', id: 'baz', published: baz},
  ])
})

test('removeDupes()', () => {
  const foo = {_type: 'foo', _id: 'foo'}
  const fooDraft = {_type: 'foo', _id: 'drafts.foo'}
  const barDraft = {_type: 'foo', _id: 'drafts.bar'}
  const baz = {_type: 'foo', _id: 'baz'}

  expect(removeDupes([foo, fooDraft, barDraft, baz])).toEqual([fooDraft, barDraft, baz])
})