import { useEffect, useState } from 'react'
import type { Note } from '../models/Note'

const notesEndpoint = '/api/note'

const getNoteLabel = (note: Note, index: number) => {
  return (
    note.title?.trim() ||
    note.name?.trim() ||
    note.content?.trim() ||
    note.text?.trim() ||
    `Note ${index + 1}`
  )
}

const getCreatedDateTime = (note: Note) => {
  if (!note.createdDate) {
    return 0
  }

  const createdTime = Date.parse(note.createdDate)

  return Number.isNaN(createdTime) ? 0 : createdTime
}

type NotesListProps = {
  onSelectNote?: (note: Note) => void
}

function NotesList({ onSelectNote }: NotesListProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadNotes = async () => {
      try {
        const response = await fetch(notesEndpoint)

        if (!response.ok) {
          throw new Error('Unable to load notes.')
        }

        const data = (await response.json()) as Note[]

        if (isMounted) {
          setNotes(
            Array.isArray(data)
              ? [...data].sort(
                  (firstNote, secondNote) =>
                    getCreatedDateTime(secondNote) - getCreatedDateTime(firstNote),
                )
              : [],
          )
          setError(null)
        }
      } catch {
        if (isMounted) {
          setError('Unable to load notes.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadNotes()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="mt-5">
      <h2 className="text-base font-semibold text-[#242424]">Notes</h2>

      {isLoading ? (
        <p className="mt-3 text-sm text-[#5f6b7a]">Loading notes...</p>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      {!isLoading && !error && notes.length === 0 ? (
        <p className="mt-3 text-sm text-[#5f6b7a]">No notes found.</p>
      ) : null}

      {!isLoading && !error && notes.length > 0 ? (
        <ul className="mt-3 grid gap-2">
          {notes.map((note, index) => (
            <li
              key={note.id ?? index}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border border-[#d0d7de] bg-white p-3 text-sm font-medium text-[#242424] shadow-sm"
            >
              <button
                className="min-w-0 text-left hover:text-[#0078d4]"
                type="button"
                onClick={() => onSelectNote?.(note)}
              >
                {getNoteLabel(note, index)}
              </button>
              <span className="text-right text-xs font-normal text-[#5f6b7a]">
                {note.createdDate ?? ''}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

export default NotesList
