import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Rocket } from 'lucide-react'
import { CATEGORIES } from '../data.js'
import { useEvents } from '../events.jsx'
import { useAuth } from '../auth.jsx'
import { EventCard } from '../components/Event.jsx'

const EMO = ['🎶', '🤖', '😂', '🏆', '🧠', '🍛', '🖼️', '🎉', '🚀', '🎭']

export default function Create() {
  const { createEvent } = useEvents()
  const { user } = useAuth()
  const nav = useNavigate()
  const d = new Date(); d.setDate(d.getDate() + 14); d.setHours(18, 0, 0, 0)
  const [f, setF] = useState({ title: '', category: 'Tech', venue: '', city: '', price: 499, date: d.toISOString().slice(0, 16), duration: 3, rows: 8, cols: 14, emoji: '🎉', description: '' })
  const cat = CATEGORIES.find((c) => c.id === f.category)
  const ev = { ...f, id: 'preview', date: new Date(f.date).toISOString(), color: cat.color, title: f.title || 'Your event title', venue: f.venue || 'Venue', city: f.city || 'City', agenda: [['Doors open', 0], ['Main programme', 1]], hosts: [user.name], organizer: user.id }
  const set = (k, num) => (e) => setF({ ...f, [k]: num ? +e.target.value : e.target.value })

  return (
    <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.4fr) minmax(280px,1fr)', gap: 18 }}>
      <form className="card col fade-up" onSubmit={(e) => { e.preventDefault(); createEvent({ ...ev, id: undefined }); nav('/organizer') }}>
        <div className="section-title"><Rocket size={18} /> Create an event</div>
        <div className="field"><label>Title</label><input className="input" required value={f.title} onChange={set('title')} /></div>
        <div className="grid grid-2">
          <div className="field"><label>Category</label><select className="input" value={f.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c.id}>{c.id}</option>)}</select></div>
          <div className="field"><label>Date & time</label><input className="input" type="datetime-local" required value={f.date} onChange={set('date')} /></div>
          <div className="field"><label>Venue</label><input className="input" required value={f.venue} onChange={set('venue')} /></div>
          <div className="field"><label>City</label><input className="input" required value={f.city} onChange={set('city')} /></div>
          <div className="field"><label>Base price (₹) — VIP 2.5×, Premium 1.5×</label><input className="input" type="number" min="0" value={f.price} onChange={set('price', 1)} /></div>
          <div className="field"><label>Duration (hours)</label><input className="input" type="number" min="1" value={f.duration} onChange={set('duration', 1)} /></div>
          <div className="field"><label>Seat rows: {f.rows}</label><input type="range" min="4" max="12" value={f.rows} onChange={set('rows', 1)} style={{ accentColor: 'var(--accent)' }} /></div>
          <div className="field"><label>Seats per row: {f.cols}</label><input type="range" min="6" max="18" value={f.cols} onChange={set('cols', 1)} style={{ accentColor: 'var(--accent)' }} /></div>
        </div>
        <div className="field"><label>Banner icon</label><div className="row wrap">{EMO.map((x) => <button type="button" key={x} className={`chip ${f.emoji === x ? 'active' : ''}`} onClick={() => setF({ ...f, emoji: x })}>{x}</button>)}</div></div>
        <div className="field"><label>Description</label><textarea className="input" rows="3" required value={f.description} onChange={set('description')} /></div>
        <button className="btn"><Rocket size={16} /> Publish event · {f.rows * f.cols} seats</button>
      </form>
      <div className="col"><div className="xs muted bold">LIVE PREVIEW</div><div style={{ pointerEvents: 'none' }}><EventCard e={ev} onOpen={() => {}} /></div></div>
    </div>
  )
}
