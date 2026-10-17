import { useState } from 'react'
import { Ticket, Printer, XCircle } from 'lucide-react'
import { useEvents } from '../events.jsx'
import { TicketView } from '../components/Event.jsx'
import Empty from '../components/Empty.jsx'

export default function Tickets() {
  const { myOrders, events, cancelOrder } = useEvents()
  const [tab, setTab] = useState('upcoming')
  const rows = myOrders.map((o) => ({ o, e: events.find((x) => x.id === o.eventId) })).filter((x) => x.e)
  const list = rows.filter(({ o, e }) => tab === 'cancelled' ? o.status === 'cancelled' : o.status !== 'cancelled' && (tab === 'upcoming' ? new Date(e.date) > Date.now() : new Date(e.date) <= Date.now()))
  return (
    <div className="col" style={{ gap: 18 }}>
      <div className="tabs">{['upcoming', 'past', 'cancelled'].map((t) => <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>)}</div>
      {!list.length ? <Empty icon={Ticket} title="No tickets here" text="Book an event and your QR tickets will appear here." /> : (
        <div className="col stagger" style={{ alignItems: 'center' }}>{list.map(({ o, e }) => (
          <div key={o.id} className="col" style={{ alignItems: 'center', gap: 8, width: '100%' }}>
            <TicketView o={o} e={e} />
            {o.status !== 'cancelled' && <div className="row"><button className="btn ghost sm" onClick={() => window.print()}><Printer size={14} /> Print</button>{tab === 'upcoming' && <button className="btn ghost sm" onClick={() => confirm('Cancel this booking?') && cancelOrder(o.id)}><XCircle size={14} /> Cancel</button>}</div>}
          </div>))}</div>
      )}
    </div>
  )
}
