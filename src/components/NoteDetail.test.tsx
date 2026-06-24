import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import NoteDetail from './NoteDetail'

describe('NoteDetail', () => {
  const fetchMock = vi.fn()
  const note = {
    id: 7,
    title: 'Project ideas',
    detail: 'Build the update flow.',
    tag: 'work',
    isEncrypt: true,
  }

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
  })

  it('starts read-only and switches to edit mode', () => {
    render(<NoteDetail note={note} onBack={vi.fn()} onUpdated={vi.fn()} />)

    expect(screen.getByText('Build the update flow.')).toBeInTheDocument()
    expect(screen.queryByLabelText('Title')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    expect(screen.getByLabelText('Title')).toHaveValue('Project ideas')
    expect(screen.getByLabelText('Note')).toHaveValue('Build the update flow.')
    expect(screen.getByLabelText('Tag')).toHaveValue('work')
    expect(screen.getByRole('checkbox', { name: 'Encrypt this note' }))
      .toBeChecked()
  })

  it('updates the note when edit form is saved', async () => {
    const onUpdated = vi.fn()
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })

    render(<NoteDetail note={note} onBack={vi.fn()} onUpdated={onUpdated} />)

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Updated ideas' },
    })
    fireEvent.change(screen.getByLabelText('Note'), {
      target: { value: 'Ship note editing.' },
    })
    fireEvent.change(screen.getByLabelText('Tag'), {
      target: { value: 'product' },
    })
    fireEvent.click(screen.getByRole('checkbox', { name: 'Encrypt this note' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save note' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/note/7', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Updated ideas',
          detail: 'Ship note editing.',
          tag: 'product',
          isEncrypt: false,
        }),
      })
    })
    expect(onUpdated).toHaveBeenCalledWith({
      ...note,
      title: 'Updated ideas',
      detail: 'Ship note editing.',
      tag: 'product',
      isEncrypt: false,
    })
  })
})
