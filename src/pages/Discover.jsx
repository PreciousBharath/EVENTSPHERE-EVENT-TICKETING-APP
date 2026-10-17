import { useMemo, useState } from 'react'
import { Search, Sparkles, CalendarX } from 'lucide-react'
import { CATEGORIES, fmtDate } from '../data.js'
import { EventCard, EventModal, Countdown, Banner } from '../components/Event.jsx'
import Empty from '../components/Empty.jsx'
import { useEvents } from '../events.jsx'

export default function Discover({ savedOnly = false }) {
  const ev = useEvents()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [city, setCity] = useState('All')
  const [when, setWhen] = useState('any')
  const [maxPrice, setMaxPrice] = useState(1500)
  const [sort, setSort] = useState('date')
  const [open, setOpen] = useState(null)
  const upcoming = ev.events.filter((e) => new Date(e.date) > Date.now())
  const featured = upcoming.find((e) => e.featured) || upcoming[0]

  const list = useMemo(() => upcoming
    .filter((e) => !savedOnly || ev.saved.includes(e.id))
    .filter((e) => `${e.title} ${e.venue} ${e.city}`.toLowerCase().includes(q.toLowerCase()))
    .filter((e) => (cat === 'All' || e.category === cat) && (city === 'All' || e.city === city) && e.price <= maxPrice)
    .filter((e) => { const d = (new Date(e.date) - Date.now()) / 864e5; return when === 'any' || (when === 'week' ? d <= 7 : when === 'month' ? d <= 30 : new Date(e.date).getDay() % 6 === 0) })
    .sort((a, b) => ({ date: new Date(a.date) - new Date(b.date), price: a.price - b.price, popular: ev.soldCount(b) - ev.soldCount(a) }[sort])), [upcoming, q, cat, city, when, maxPrice, sort, savedOnly, ev])

  return (
    <div className="col" style={{ gap: 20 }}>
      {!savedOnly && featured && (
        <div className="card fade-up" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => setOpen(featured.id)}>
          <Banner e={featured} height={230}>
            <div style={{ position: 'absolute', left: 26, top: 24, right: 140 }} className="col">
              <span className="badge" style={{ background: 'rgba(255,255,255,.2)', color: '#fff', width: 'fit-content' }}><Sparkles size={12} /> Featured</span>
              <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 800 }}>{featured.title}</h2>
              <div className="small">{fmtDate(featured.date)} · {featured.venue}, {featured.city}</div>
              <div style={{ color: 'var(--text)' }}><Countdown to={featured.date} /></div>
            </div>
          </Banner>
        </div>
      )}
      <div className="row wrap">
        <div className="input-icon" style={{ flex: 1, minWidth: 220 }}><Search size={17} /><input className="input" placeholder="Search events, venues, cities…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className="input" style={{ width: 150 }} value={city} onChange={(e) => setCity(e.target.value)}><option>All</option>{[...new Set(ev.events.map((e) => e.city))].map((c) => <option key={c}>{c}</option>)}</select>
        <select className="input" style={{ width: 150 }} value={sort} onChange={(e) => setSort(e.target.value)}><option value="date">Soonest</option><option value="price">Cheapest</option><option value="popular">Selling fast</option></select>
      </div>
      <div className="row wrap between">
        <div className="row wrap"><button className={`chip ${cat === 'All' ? 'active' : ''}`} onClick={() => setCat('All')}>All</button>{CATEGORIES.map((c) => <button key={c.id} className={`chip ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}>{c.icon} {c.id}</button>)}</div>
        <div className="row wrap"><div className="tabs">{[['any', 'Any time'], ['week', 'This week'], ['month', 'This month'], ['weekend', 'Weekends']].map(([k, l]) => <button key={k} className={when === k ? 'active' : ''} onClick={() => setWhen(k)}>{l}</button>)}</div>
          <span className="row small">≤ ₹{maxPrice}<input type="range" min="100" max="1500" step="50" value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} style={{ accentColor: 'var(--accent)' }} /></span></div>
      </div>
      {!list.length ? <Empty icon={CalendarX} title={savedOnly ? 'No saved events' : 'No events found'} text={savedOnly ? 'Tap the heart on any event to save it.' : 'Try other filters.'} /> : (
        <div className="grid grid-3 stagger">{list.map((e) => <EventCard key={e.id} e={e} onOpen={setOpen} />)}</div>
      )}
      {open && <EventModal id={open} onClose={() => setOpen(null)} />}
    </div>
  )
}
