import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import NotesList from './NotesList'

describe('NotesList', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
  })

  it('loads notes from the notes API and renders them', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, title: 'Plan Toronto trip' },
        { id: 2, title: 'Review React notes' },
      ],
    })

    render(<NotesList />)

    expect(fetchMock).toHaveBeenCalledWith('/api/note')
    expect(await screen.findByText('Plan Toronto trip')).toBeInTheDocument()
    expect(screen.getByText('Review React notes')).toBeInTheDocument()
  })

  it('sorts notes by created date descending and renders each date', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, title: 'Older note', createdDate: '2026-06-22' },
        { id: 2, title: 'Newest note', createdDate: '2026-06-24' },
        { id: 3, title: 'Middle note', createdDate: '2026-06-23' },
      ],
    })

    render(<NotesList />)

    const noteButtons = await screen.findAllByRole('button')

    expect(noteButtons.map((button) => button.textContent)).toEqual([
      'Newest note',
      'Middle note',
      'Older note',
    ])
    expect(screen.getByText('2026-06-24')).toBeInTheDocument()
    expect(screen.getByText('2026-06-23')).toBeInTheDocument()
    expect(screen.getByText('2026-06-22')).toBeInTheDocument()
  })

  it('notifies when a note is selected', async () => {
    const onSelectNote = vi.fn()
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: 'Plan Toronto trip',
          detail: 'Book the train.',
          tag: 'travel',
          isEncrypt: false,
        },
      ],
    })

    render(<NotesList onSelectNote={onSelectNote} />)

    fireEvent.click(await screen.findByRole('button', {
      name: 'Plan Toronto trip',
    }))

    expect(onSelectNote).toHaveBeenCalledWith({
      id: 1,
      title: 'Plan Toronto trip',
      detail: 'Book the train.',
      tag: 'travel',
      isEncrypt: false,
    })
  })
})
