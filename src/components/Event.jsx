import { useEffect, useState } from 'react'
import { Heart, MapPin, Clock, Users, Ticket, Tag, Check, ChevronRight, Wallet } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import Modal from './Modal.jsx'
import { useEvents } from '../events.jsx'
import { useAuth } from '../auth.jsx'
import { TIERS, tierOf, seatLabel, PROMOS, fmtDate } from '../data.js'

export function Countdown({ to, compact }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  const d = Math.max(0, new Date(to) - now)
  const p = [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60]
  if (compact) return <span>{p[0]}d {p[1]}h {p[2]}m</span>
  return <div className="row" style={{ gap: 8 }}>{p.map((v, i) => <div key={i} className="cd-box"><b>{String(v).padStart(2, '0')}</b><span>{['days', 'hrs', 'min', 'sec'][i]}</span></div>)}</div>
}

export const Banner = ({ e, height = 150, children }) => (
  <div className="ev-banner" style={{ height, background: `radial-gradient(circle at 80% 20%, ${e.color}, color-mix(in srgb, ${e.color} 30%, #0b0d17) 75%)` }}>
    <span className="ev-emoji">{e.emoji}</span>{children}
  </div>
)

export function EventCard({ e, onOpen }) {
  const { saved, toggleSave, soldCount, capacity } = useEvents()
  const left = capacity(e) - soldCount(e)
  const pct = (soldCount(e) / capacity(e)) * 100
  const dt = new Date(e.date)
  return (
    <div className="card hover col" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => onOpen(e.id)}>
      <Banner e={e}>
        <div className="ev-date"><b>{dt.getDate()}</b><span>{dt.toLocaleDateString(undefined, { month: 'short' })}</span></div>
        <button className="btn icon sm ev-heart" onClick={(x) => { x.stopPropagation(); toggleSave(e.id) }}><Heart size={15} fill={saved.includes(e.id) ? '#fff' : 'none'} /></button>
        <span className="badge ev-cat">{e.category}</span>
      </Banner>
      <div className="col" style={{ padding: 16, gap: 8 }}>
        <b style={{ fontSize: '1.05rem' }}>{e.title}</b>
        <div className="small muted row" style={{ gap: 4 }}><MapPin size={14} />{e.venue}, {e.city}</div>
        <div className="small muted row" style={{ gap: 4 }}><Clock size={14} />{fmtDate(e.date)}</div>
        <div className="xs bold gradient-text">⏳ Starts in <Countdown to={e.date} compact /></div>
        <div className="progress" style={{ height: 6 }}><div style={{ width: `${pct}%`, background: pct > 75 ? 'var(--danger)' : undefined }} /></div>
        <div className="row between"><span className="xs" style={{ color: left < 40 ? 'var(--danger)' : 'var(--muted)', fontWeight: 700 }}>{left < 40 ? `🔥 Only ${left} left` : `${left} seats left`}</span><b>from ₹{e.price}</b></div>
      </div>
    </div>
  )
}

function SeatMap({ e, selected, toggle }) {
  const { isSold } = useEvents()
  return (
    <div className="col" style={{ alignItems: 'center', gap: 10 }}>
      <div className="stage">STAGE</div>
      <div className="seatmap">
        {Array.from({ length: e.rows }).map((_, r) => (
          <div key={r} className="row" style={{ gap: 5 }}>
            <span className="xs muted" style={{ width: 14 }}>{String.fromCharCode(65 + r)}</span>
            {Array.from({ length: e.cols }).map((_, c) => {
              const l = seatLabel(r, c), sold = isSold(e.id, r, c, l), sel = selected.includes(l), t = tierOf(r)
              return <button key={c} title={`${l} · ${t.id}`} disabled={sold} className={`seat ${sel ? 'sel' : ''}`} style={{ '--tier': t.color, marginRight: c === 6 ? 14 : 0 }} onClick={() => toggle(l, r)} />
            })}
          </div>
        ))}
      </div>
      <div className="row wrap small" style={{ justifyContent: 'center' }}>
        {TIERS.map((t) => <span key={t.id} className="row" style={{ gap: 5 }}><span className="seat demo" style={{ '--tier': t.color }} />{t.id} ₹{Math.round(e.price * t.mult)}</span>)}
        <span className="row" style={{ gap: 5 }}><span className="seat demo sold" />Sold</span><span className="row" style={{ gap: 5 }}><span className="seat demo sel" style={{ '--tier': 'var(--accent)' }} />Yours</span>
      </div>
    </div>
  )
}

function Confetti() {
  const colors = ['#f59e0b', '#ec4899', '#6366f1', '#10b981', '#06b6d4']
  return <div className="confetti">{Array.from({ length: 60 }).map((_, i) => <i key={i} style={{ left: `${Math.random() * 100}%`, background: colors[i % 5], animationDelay: `${Math.random() * 0.8}s`, transform: `rotate(${Math.random() * 360}deg)` }} />)}</div>
}

export function EventModal({ id, onClose }) {
  const ev = useEvents()
  const { user } = useAuth()
  const e = ev.events.find((x) => x.id === id)
  const [step, setStep] = useState(0)
  const [seats, setSeats] = useState([])
  const [promo, setPromo] = useState('')
  const [applied, setApplied] = useState(null)
  const [att, setAtt] = useState({ name: user.name, email: user.email, phone: '' })
  const [order, setOrder] = useState(null)

  const toggle = (l, r) => setSeats(seats.includes(l) ? seats.filter((x) => x !== l) : seats.length >= 6 ? seats : [...seats, l])
  const priceOf = (l) => Math.round(e.price * tierOf(l.charCodeAt(0) - 65).mult)
  const subtotal = seats.reduce((s, l) => s + priceOf(l), 0)
  const discount = applied ? Math.round(subtotal * PROMOS[applied]) : 0
  const fee = Math.round((subtotal - discount) * 0.05)
  const total = subtotal - discount + fee

  return (
    <Modal title="" onClose={onClose} width={820}>
      {order && <Confetti />}
      <div style={{ marginTop: -36 }}>
        <Banner e={e} height={170}><div className="ev-title"><div className="badge" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>{e.category}</div><h2>{e.title}</h2><div className="small">{fmtDate(e.date)} · {e.venue}, {e.city}</div></div></Banner>
      </div>
      <div className="steps mt">{['Details', 'Seats', 'Checkout', 'Tickets'].map((s, i) => <div key={s} className={`step ${i <= step ? 'on' : ''}`}><span>{i < step ? <Check size={13} /> : i + 1}</span>{s}</div>)}</div>

      {step === 0 && (
        <div className="grid grid-2 mt fade-up">
          <div className="col"><p>{e.description}</p><div className="row small"><Users size={15} /> Hosted by {e.hosts.join(' & ')}</div><div className="row small"><Clock size={15} /> {e.duration} hours</div>
            <div className="col small" style={{ gap: 6 }}><b>Agenda</b>{e.agenda.map(([a, h], i) => <div key={i} className="row"><span className="badge">+{h}h</span>{a}</div>)}</div></div>
          <div className="card col" style={{ alignItems: 'center', gap: 12 }}><span className="muted small">Starts in</span><Countdown to={e.date} /><b style={{ fontSize: '1.4rem' }}>from ₹{e.price}</b>
            <button className="btn block" onClick={() => setStep(1)}><Ticket size={16} /> Select seats</button>
            <button className="btn ghost block" onClick={() => ev.toggleSave(e.id)}><Heart size={16} /> {ev.saved.includes(e.id) ? 'Saved' : 'Save for later'}</button></div>
        </div>
      )}
      {step === 1 && (
        <div className="col mt fade-up">
          <SeatMap e={e} selected={seats} toggle={toggle} />
          <div className="card row between wrap"><span className="small">{seats.length ? <>Seats <b>{seats.join(', ')}</b> · ₹{subtotal}</> : 'Pick up to 6 seats'}</span><div className="row"><button className="btn ghost" onClick={() => setStep(0)}>Back</button><button className="btn" disabled={!seats.length} onClick={() => setStep(2)}>Continue <ChevronRight size={16} /></button></div></div>
        </div>
      )}
      {step === 2 && (
        <div className="grid grid-2 mt fade-up">
          <div className="col">
            <b>Attendee details</b>
            <input className="input" placeholder="Full name" value={att.name} onChange={(x) => setAtt({ ...att, name: x.target.value })} />
            <input className="input" placeholder="Email" value={att.email} onChange={(x) => setAtt({ ...att, email: x.target.value })} />
            <input className="input" placeholder="Phone (optional)" value={att.phone} onChange={(x) => setAtt({ ...att, phone: x.target.value })} />
            <div className="row"><div className="input-icon" style={{ flex: 1 }}><Tag size={16} /><input className="input" placeholder="Promo code" value={promo} onChange={(x) => setPromo(x.target.value.toUpperCase())} /></div><button className="btn ghost" onClick={() => setApplied(PROMOS[promo] ? promo : (alert('Invalid code — try EARLY10'), null))}>Apply</button></div>
            {applied && <span className="badge green">✓ {applied} applied — {PROMOS[applied] * 100}% off</span>}
          </div>
          <div className="card col">
            <b>Order summary</b>
            {seats.map((l) => <div key={l} className="row between small"><span>Seat {l} · {tierOf(l.charCodeAt(0) - 65).id}</span><span>₹{priceOf(l)}</span></div>)}
            <hr style={{ border: 'none', borderTop: '1px dashed var(--border)' }} />
            <div className="row between small"><span>Subtotal</span><span>₹{subtotal}</span></div>
            {discount > 0 && <div className="row between small" style={{ color: 'var(--success)' }}><span>Discount</span><span>−₹{discount}</span></div>}
            <div className="row between small"><span>Booking fee (5%)</span><span>₹{fee}</span></div>
            <div className="row between bold" style={{ fontSize: '1.2rem' }}><span>Total</span><span className="gradient-text">₹{total}</span></div>
            <button className="btn block" disabled={!att.name || !att.email} onClick={() => { setOrder(ev.checkout({ eventId: e.id, seats, total, promo: applied, attendee: att })); setStep(3) }}><Wallet size={16} /> Pay ₹{total} (demo wallet)</button>
            <button className="btn ghost block" onClick={() => setStep(1)}>Back to seats</button>
            <span className="xs muted">Demo checkout — no real payment is taken.</span>
          </div>
        </div>
      )}
      {step === 3 && order && (
        <div className="col mt fade-up" style={{ alignItems: 'center', textAlign: 'center' }}>
          <h2 style={{ fontWeight: 800 }}>You’re going! 🎉</h2>
          <TicketView o={order} e={e} />
          <button className="btn" onClick={onClose}>Done</button>
        </div>
      )}
    </Modal>
  )
}

export function TicketView({ o, e }) {
  return (
    <div className="ticket">
      <div className="ticket-main">
        <div className="xs" style={{ opacity: 0.8 }}>{e.category.toUpperCase()} · E-TICKET</div>
        <b style={{ fontSize: '1.2rem' }}>{e.title}</b>
        <div className="small">{fmtDate(e.date)}</div>
        <div className="small">{e.venue}, {e.city}</div>
        <div className="small">Seats: <b>{o.seats.join(', ')}</b></div>
        <div className="xs" style={{ opacity: 0.8 }}>{o.attendee.name} · ₹{o.total}</div>
      </div>
      <div className="ticket-stub">
        <div style={{ background: '#fff', padding: 6, borderRadius: 10 }}><QRCodeSVG value={`EVENTSPHERE|${o.id}|${e.id}|${o.seats.join(',')}`} size={96} /></div>
        <div className="xs bold" style={{ letterSpacing: 1 }}>#{o.id}</div>
        {o.checkedIn ? <span className="badge green">Checked in</span> : o.status === 'cancelled' ? <span className="badge red">Cancelled</span> : null}
      </div>
    </div>
  )
}
