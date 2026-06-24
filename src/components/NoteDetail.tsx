import { useState, type FormEvent } from 'react'
import type { Note } from '../models/Note'

type NoteDetailProps = {
  note: Note
  onBack: () => void
  onUpdated: (note: Note) => void
}

const getTitle = (note: Note) => note.title ?? note.name ?? ''
const getDetail = (note: Note) => note.detail ?? note.content ?? note.text ?? ''

function NoteDetail({ note, onBack, onUpdated }: NoteDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const updatedNote = {
      ...note,
      title: String(formData.get('title') ?? ''),
      detail: String(formData.get('detail') ?? ''),
      tag: String(formData.get('tag') ?? ''),
      isEncrypt: formData.get('isEncrypt') === 'on',
    }

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/note/${note.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updatedNote.title,
          detail: updatedNote.detail,
          tag: updatedNote.tag,
          isEncrypt: updatedNote.isEncrypt,
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to update note.')
      }

      setIsEditing(false)
      onUpdated(updatedNote)
    } catch {
      setError('Unable to update note.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isEditing) {
    return (
      <form className="mt-5 grid max-w-3xl gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-semibold text-[#242424]">
          Title
          <input
            className="h-10 border border-[#d0d7de] bg-white px-3 text-sm font-normal text-[#242424] outline-none focus:border-[#0078d4]"
            defaultValue={getTitle(note)}
            name="title"
            type="text"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-[#242424]">
          Note
          <textarea
            className="min-h-56 resize-y border border-[#d0d7de] bg-white p-3 text-sm font-normal text-[#242424] outline-none focus:border-[#0078d4]"
            defaultValue={getDetail(note)}
            name="detail"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-[#242424]">
          Tag
          <input
            className="h-10 border border-[#d0d7de] bg-white px-3 text-sm font-normal text-[#242424] outline-none focus:border-[#0078d4]"
            defaultValue={note.tag ?? ''}
            name="tag"
            type="text"
          />
        </label>

        <label className="flex items-center gap-2 text-sm font-semibold text-[#242424]">
          <input
            className="size-4 accent-[#0078d4]"
            defaultChecked={Boolean(note.isEncrypt)}
            name="isEncrypt"
            type="checkbox"
          />
          Encrypt this note
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex gap-2">
          <button
            className="h-9 bg-[#0078d4] px-4 text-sm font-semibold text-white hover:bg-[#106ebe]"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? 'Saving...' : 'Save note'}
          </button>
          <button
            className="h-9 border border-[#d0d7de] bg-white px-4 text-sm font-semibold text-[#242424] hover:bg-[#f3f2f1]"
            type="button"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }

  return (
    <section className="mt-5 grid max-w-3xl gap-4">
      <div className="border border-[#d0d7de] bg-white p-4 shadow-sm">
        <div className="grid gap-3">
          <div>
            <h2 className="text-sm font-semibold text-[#605e5c]">Title</h2>
            <p className="mt-1 text-base font-semibold text-[#242424]">
              {getTitle(note)}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#605e5c]">Note</h2>
            <p className="mt-1 whitespace-pre-wrap text-sm text-[#242424]">
              {getDetail(note)}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-[#475569]">
            <span>Tag: {note.tag || 'None'}</span>
            <span>{note.isEncrypt ? 'Encrypted' : 'Not encrypted'}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="h-9 bg-[#0078d4] px-4 text-sm font-semibold text-white hover:bg-[#106ebe]"
          type="button"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <button
          className="h-9 border border-[#d0d7de] bg-white px-4 text-sm font-semibold text-[#242424] hover:bg-[#f3f2f1]"
          type="button"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </section>
  )
}

export default NoteDetail
