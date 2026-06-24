import { type ReactNode, useState } from 'react'
import archiveIcon from './assets/archive.svg'
import homeIcon from './assets/home.svg'
import leftIcon from './assets/left.svg'
import notesIcon from './assets/notes.svg'
import rightIcon from './assets/right.svg'
import tagsIcon from './assets/tags.svg'
import Archive from './components/Archive'
import Categories from './components/Categories'
import NewNote from './components/NewNote'
import NoteDetail from './components/NoteDetail'
import NotesList from './components/NotesList'
import type { Note } from './models/Note'

type Page = 'home' | 'notes' | 'new-note' | 'note-detail' | 'categories' | 'archive'

const navigationItems = [
  { label: 'Home', icon: homeIcon, page: 'home' },
  { label: 'Notes', icon: notesIcon, page: 'notes' },
  { label: 'Tags', icon: tagsIcon, page: 'categories' },
  { label: 'Archive', icon: archiveIcon, page: 'archive' },
] satisfies Array<{
  label: string
  icon: string
  page: Page
}>

const pageTitles: Record<Page, string> = {
  home: 'Home',
  notes: 'Notes',
  'new-note': 'New Note',
  'note-detail': 'Note Detail',
  categories: 'Categories',
  archive: 'Archive',
}

const renderPageContent = (
  page: Page,
  setPage: (page: Page) => void,
  selectedNote: Note | null,
  setSelectedNote: (note: Note | null) => void,
) => {
  if (page !== 'home') {
    const pageContent: Record<Exclude<Page, 'home'>, ReactNode> = {
      notes: (
        <NotesList
          onSelectNote={(note) => {
            setSelectedNote(note)
            setPage('note-detail')
          }}
        />
      ),
      'new-note': (
        <NewNote
          onCancel={() => setPage('notes')}
          onSaved={() => setPage('notes')}
        />
      ),
      'note-detail': selectedNote ? (
        <NoteDetail
          note={selectedNote}
          onBack={() => setPage('notes')}
          onUpdated={(note) => {
            setSelectedNote(note)
            setPage('notes')
          }}
        />
      ) : (
        <p className="mt-5 text-sm text-[#5f6b7a]">No note selected.</p>
      ),
      categories: <Categories />,
      archive: <Archive />,
    }

    return pageContent[page]
  }

  return (
    <>
      <section
        className="mt-5 grid gap-3 lg:grid-cols-[2fr_1fr_1fr]"
        aria-label="Notes summary"
      >
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className="border border-[#d0d7de] bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#605e5c]">
                {card.label}
              </p>
              <span className={`h-1.5 w-10 ${card.accent}`} />
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-3xl font-semibold text-[#242424]">
                {card.value}
              </span>
              <span className="pb-1 text-sm text-[#5f6b7a]">
                {card.detail}
              </span>
            </div>
            {card.label === 'Today' ? (
              <div className="mt-4 h-1.5 bg-[#dbeafe]">
                <div className="h-1.5 w-[62%] bg-[#0078d4]" />
              </div>
            ) : null}
          </article>
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[2fr_1fr]">
        <aside className="border border-[#d0d7de] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#242424]">
              Activity
            </h2>
            <span className="text-xs text-[#5f6b7a]">Today</span>
          </div>
          <ol className="mt-4 grid gap-3">
            {activityItems.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-[#475569]">
                <span className="mt-1 size-2 bg-[#0078d4]" />
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </aside>
      </section>
    </>
  )
}

const summaryCards = [
  {
    label: 'Today',
    value: '4',
    detail: 'notes updated',
    accent: 'bg-[#0078d4]',
  },
  {
    label: 'This Week',
    value: '7',
    detail: 'priority notes',
    accent: 'bg-[#50e6ff]',
  },
  {
    label: 'Previous',
    value: '18',
    detail: 'active topics',
    accent: 'bg-[#107c10]',
  },
]



const activityItems = [
  'Pinned 2 notes',
  'Created Design notebook',
  'Updated Tailwind setup',
]

function Home() {
  const [isNavExpanded, setIsNavExpanded] = useState(false)
  const [page, setPage] = useState<Page>('home')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [user] = useState({ name: 'Gary' })

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#1f1f1f]">
      <header className="grid h-12 grid-cols-[minmax(180px,220px)_minmax(220px,520px)_auto] items-center gap-5 bg-[#0078d4] px-4 text-white max-md:grid-cols-[1fr_auto]">
        <div className="flex items-center gap-3">
          <div className="grid size-6 place-items-center bg-white text-sm font-semibold text-[#0078d4]">
            N
          </div>
          <span className="text-sm font-semibold">My Daily Notes</span>
        </div>

        <label className="flex h-8 items-center border border-black/20 bg-white px-3 text-sm text-slate-500 shadow-sm max-md:hidden">
          <span className="mr-2 text-[#0078d4]" aria-hidden="true">
            /
          </span>
          <input
            className="h-full w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500"
            placeholder="Search notes, tags, notebooks"
            type="search"
          />
        </label>

        <div className="flex items-center justify-end gap-2 text-xs">
          <button
            className="grid size-8 place-items-center hover:bg-white/15"
            type="button"
            aria-label="Help"
            title="Help"
          >
            ?
          </button>
          <button
            className="hidden h-8 px-3 hover:bg-white/15 sm:block"
            type="button"
          >
            Settings
          </button>
          <button
            className="grid size-8 place-items-center bg-white/20 font-semibold"
            type="button"
            aria-label="User profile"
            title="User profile"
          >
            {user.name}
          </button>
        </div>
      </header>

      <div
        className={`grid min-h-[calc(100vh-3rem)] transition-[grid-template-columns] max-sm:grid-cols-1 ${
          isNavExpanded ? 'grid-cols-[180px_1fr]' : 'grid-cols-[64px_1fr]'
        }`}
      >
        <aside className="border-r border-[#d0d7de] bg-[#f3f2f1] max-sm:hidden">
          <nav className="grid gap-1 p-1.5" aria-label="Primary navigation">
            <button
              className={`flex h-10 items-center border-l-[3px] border-transparent px-3 text-sm font-semibold text-[#475569] transition hover:bg-white/70 ${
                isNavExpanded ? 'justify-between' : 'justify-center'
              }`}
              type="button"
              aria-label={
                isNavExpanded ? 'Collapse navigation' : 'Expand navigation'
              }
              aria-expanded={isNavExpanded}
              title={isNavExpanded ? 'Collapse navigation' : 'Expand navigation'}
              onClick={() => setIsNavExpanded((current) => !current)}
            >
              <img
                className="size-5"
                src={isNavExpanded ? leftIcon : rightIcon}
                alt=""
                aria-hidden="true"
              />
              {isNavExpanded ? <span>Collapse</span> : null}
            </button>

            {navigationItems.map((item) => {
              const isActive = item.page === page

              return (
              <button
                key={item.label}
                className={`flex h-11 items-center border-l-[3px] px-3 text-sm font-semibold transition ${
                  isActive
                    ? 'border-[#0078d4] bg-white text-[#0078d4] shadow-sm'
                    : 'border-transparent text-slate-600 hover:bg-white/70'
                } ${isNavExpanded ? 'justify-start gap-3' : 'justify-center'}`}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.label}
                title={item.label}
                onClick={() => setPage(item.page)}
              >
                <span className="grid size-5 place-items-center">
                  <img
                    className="size-5"
                    src={item.icon}
                    alt=""
                    aria-hidden="true"
                  />
                </span>
                {isNavExpanded ? <span>{item.label}</span> : null}
              </button>
              )
            })}
          </nav>
        </aside>

        <main className="min-w-0 px-6 py-5 max-md:px-4">
          <section className="flex flex-wrap items-start justify-between gap-4">
            <div>
              {/* <p className="mb-1 text-xs font-semibold uppercase text-[#605e5c]">
                Notes workspace
              </p> */}
              <h1 className="text-2xl font-semibold text-[#242424]">
                {pageTitles[page]}
              </h1>
              {/* <p className="mt-1 max-w-2xl text-sm text-[#5f6b7a]">
                Quick access to notes, notebooks, and recent activity.
              </p> */}
            </div>

            {page === 'notes' ? (
              <div className="flex gap-2">
                <button
                  className="h-9 bg-[#0078d4] px-4 text-sm font-semibold text-white hover:bg-[#106ebe]"
                  type="button"
                  onClick={() => setPage('new-note')}
                >
                  New note
                </button>
              </div>
            ) : null}
          </section>

          {renderPageContent(page, setPage, selectedNote, setSelectedNote)}
        </main>
      </div>
    </div>
  )
}

export default Home
