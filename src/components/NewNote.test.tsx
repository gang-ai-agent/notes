import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import NewNote from './NewNote'

describe('NewNote', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
  })

  it('posts a new note and notifies when saved', async () => {
    const onSaved = vi.fn()
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })

    render(<NewNote onCancel={vi.fn()} onSaved={onSaved} />)

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Project ideas' },
    })
    fireEvent.change(screen.getByLabelText('Note'), {
      target: { value: 'Build the save flow.' },
    })
    fireEvent.change(screen.getByLabelText('Tag'), {
      target: { value: 'work' },
    })
    fireEvent.click(screen.getByRole('checkbox', { name: 'Encrypt this note' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save note' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Project ideas',
          detail: 'Build the save flow.',
          tag: 'work',
          isEncrypt: true,
        }),
      })
    })
    expect(onSaved).toHaveBeenCalledTimes(1)
  })
})
