import { useState, type FormEvent } from 'react'

type NewNoteProps = {
  onCancel: () => void
  onSaved: () => void
}

function NewNote({ onCancel, onSaved }: NewNoteProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },    
        body: JSON.stringify({
          title: String(formData.get('title') ?? ''),
          detail: String(formData.get('detail') ?? ''),
          tag: String(formData.get('tag') ?? ''),
          isEncrypt: formData.get('isEncrypt') === 'on',
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to save note.')
      }

      onSaved()
    } catch {
      setError('Unable to save note.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form className="mt-5 grid max-w-3xl gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-semibold text-[#242424]">
        Title
        <input
          className="h-10 border border-[#d0d7de] bg-white px-3 text-sm font-normal text-[#242424] outline-none focus:border-[#0078d4]"
          name="title"
          type="text"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-[#242424]">
        Note
        <textarea
          className="min-h-56 resize-y border border-[#d0d7de] bg-white p-3 text-sm font-normal text-[#242424] outline-none focus:border-[#0078d4]"
          name="detail"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-[#242424]">
        Tag
        <input
          className="h-10 border border-[#d0d7de] bg-white px-3 text-sm font-normal text-[#242424] outline-none focus:border-[#0078d4]"
          name="tag"
          type="text"
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-semibold text-[#242424]">
        <input
          className="size-4 accent-[#0078d4]"
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
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default NewNote
