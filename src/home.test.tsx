import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Home from './home'

describe('Home', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
  })

  it('opens the new note page from the Notes page action', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    render(<Home />)

    fireEvent.click(screen.getByRole('button', { name: 'Notes' }))
    expect(await screen.findByRole('heading', { name: 'Notes', level: 1 }))
      .toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'New note' }))

    expect(screen.getByRole('heading', { name: 'New Note', level: 1 }))
      .toBeInTheDocument()
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Note')).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', { name: 'Encrypt this note' }),
    ).toBeInTheDocument()
  })

  it('opens note detail from the Notes page and allows editing', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 3,
            title: 'Design review',
            detail: 'Review the new note detail page.',
            tag: 'work',
            isEncrypt: false,
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

    render(<Home />)

    fireEvent.click(screen.getByRole('button', { name: 'Notes' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Design review' }))

    expect(screen.getByRole('heading', { name: 'Note Detail', level: 1 }))
      .toBeInTheDocument()
    expect(screen.getByText('Review the new note detail page.'))
      .toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    expect(screen.getByLabelText('Title')).toHaveValue('Design review')
    expect(screen.getByLabelText('Note')).toHaveValue(
      'Review the new note detail page.',
    )

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Updated design review' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save note' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Notes', level: 1 }))
        .toBeInTheDocument()
    })
  })
})
