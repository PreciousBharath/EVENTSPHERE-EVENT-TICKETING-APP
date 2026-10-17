import { useState } from 'react'
import { ScanLine, CheckCircle2, XCircle } from 'lucide-react'
import { useEvents } from '../events.jsx'

export default function Checkin() {
  const { checkIn, orders, events } = useEvents()
  const [code, setCode] = useState('')
  const [res, setRes] = useState(null)
  const recent = orders.filter((o) => o.checkedIn).sort((a, b) => b.checkedIn - a.checkedIn).slice(0, 8)
  return (
    <div className="grid grid-2">
      <form className="card col fade-up" style={{ alignItems: 'center', textAlign: 'center' }} onSubmit={(e) => { e.preventDefault(); setRes(checkIn(code)); setCode('') }}>
        <div className="scanner"><ScanLine size={64} /><span className="scan-line" /></div>
        <b>Gate check-in</b><p className="small muted">Enter the ticket ID printed under the QR code (e.g. #ABC123XY).</p>
        <input className="input" style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: 2, fontWeight: 700 }} placeholder="TICKET ID" value={code} onChange={(e) => setCode(e.target.value.replace('#', ''))} />
        <button className="btn block" disabled={!code}>Verify ticket</button>
        {res && <div key={Date.now()} className="card row fade-up" style={{ width: '100%', borderColor: res.ok ? 'var(--success)' : 'var(--danger)' }}>{res.ok ? <CheckCircle2 color="var(--success)" /> : <XCircle color="var(--danger)" />}<span className="small bold">{res.msg}</span></div>}
      </form>
      <div className="card fade-up"><div className="section-title">Recent check-ins</div>
        {!recent.length ? <p className="muted small">No check-ins yet. Book a ticket, then verify its ID here.</p> : recent.map((o) => <div key={o.id} className="row between small" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}><span><b>{o.attendee.name}</b> · {events.find((e) => e.id === o.eventId)?.title}</span><span className="badge green">{new Date(o.checkedIn).toLocaleTimeString()}</span></div>)}
      </div>
      <style>{'.scanner{position:relative;width:140px;height:140px;border-radius:24px;display:grid;place-items:center;background:var(--bg-2);color:var(--accent);overflow:hidden}.scan-line{position:absolute;left:10%;right:10%;height:3px;background:var(--accent);box-shadow:0 0 12px var(--accent);animation:scan 2s ease-in-out infinite}@keyframes scan{0%,100%{top:15%}50%{top:85%}}'}</style>
    </div>
  )
}
