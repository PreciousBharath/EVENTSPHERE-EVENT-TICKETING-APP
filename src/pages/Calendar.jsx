import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEvents } from '../events.jsx'
import { EventModal } from '../components/Event.jsx'

export default function Calendar() {
  const { events, myOrders } = useEvents()
  const [cur, setCur] = useState(() => { const d = new Date(); d.setDate(1); return d })
  const [open, setOpen] = useState(null)
  const start = new Date(cur); start.setDate(1 - cur.getDay())
  const cells = Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d })
  const mine = new Set(myOrders.filter((o) => o.status !== 'cancelled').map((o) => o.eventId))
  const same = (a, b) => a.toDateString() === b.toDateString()
  const shift = (n) => { const d = new Date(cur); d.setMonth(d.getMonth() + n); setCur(d) }

  return (
    <div className="col fade-up" style={{ gap: 14 }}>
      <div className="row between">
        <h2 style={{ fontWeight: 800 }}>{cur.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2>
        <div className="row"><button className="btn ghost icon" onClick={() => shift(-1)}><ChevronLeft size={18} /></button><button className="btn ghost sm" onClick={() => { const d = new Date(); d.setDate(1); setCur(d) }}>Today</button><button className="btn ghost icon" onClick={() => shift(1)}><ChevronRight size={18} /></button></div>
      </div>
      <div className="cal-grid">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d} className="xs bold muted" style={{ textAlign: 'center' }}>{d}</div>)}
        {cells.map((d) => { const evs = events.filter((e) => same(new Date(e.date), d)); return (
          <div key={d.toISOString()} className={`cal-cell ${same(d, new Date()) ? 'today' : ''}`} style={{ opacity: d.getMonth() === cur.getMonth() ? 1 : 0.4 }}>
            <span className="xs bold">{d.getDate()}</span>
            {evs.map((e) => <div key={e.id} className="cal-ev" style={{ background: e.color }} onClick={() => setOpen(e.id)} title={e.title}>{mine.has(e.id) ? '🎟️ ' : ''}{e.emoji} {e.title}</div>)}
          </div>) })}
      </div>
      <span className="xs muted">🎟️ = you have tickets</span>
      {open && <EventModal id={open} onClose={() => setOpen(null)} />}
    </div>
  )
}
