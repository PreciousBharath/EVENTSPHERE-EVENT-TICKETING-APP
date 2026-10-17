import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { IndianRupee, Ticket, CalendarCheck, Percent, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard.jsx'
import { useEvents } from '../events.jsx'
import { useAuth } from '../auth.jsx'
import { CATEGORIES, fmtDate } from '../data.js'

const tip = { background: 'var(--card-solid)', border: '1px solid var(--border)', borderRadius: 12 }

export default function Organizer() {
  const ev = useEvents()
  const { user } = useAuth()
  const mineOnly = ev.events.filter((e) => e.organizer === user.id)
  const scope = mineOnly.length ? mineOnly : ev.events
  const rows = scope.map((e) => { const sold = ev.soldCount(e); return { name: e.title.length > 14 ? `${e.title.slice(0, 14)}…` : e.title, e, sold, revenue: sold * e.price, fill: (sold / ev.capacity(e)) * 100 } })
  const revenue = rows.reduce((s, r) => s + r.revenue, 0)
  const tickets = rows.reduce((s, r) => s + r.sold, 0)
  const byCat = CATEGORIES.map((c) => ({ name: c.id, value: rows.filter((r) => r.e.category === c.id).reduce((s, r) => s + r.revenue, 0), color: c.color })).filter((x) => x.value)

  return (
    <div className="col" style={{ gap: 20 }}>
      <div className="card row between wrap fade-up"><span className="small">{mineOnly.length ? `Showing analytics for your ${mineOnly.length} event(s).` : 'You haven’t hosted events yet — showing platform-wide analytics.'}</span><Link to="/create" className="btn sm">+ Create event</Link></div>
      <div className="grid grid-4 stagger">
        <StatCard icon={IndianRupee} label="Gross revenue" value={revenue} prefix="₹" />
        <StatCard icon={Ticket} label="Tickets sold" value={tickets} />
        <StatCard icon={CalendarCheck} label="Events" value={scope.length} />
        <StatCard icon={Percent} label="Avg. occupancy" value={rows.reduce((s, r) => s + r.fill, 0) / (rows.length || 1)} suffix="%" decimals={1} />
      </div>
      <div className="grid grid-2">
        <div className="card fade-up"><div className="section-title">Tickets sold per event</div>
          <div style={{ height: 300 }}><ResponsiveContainer><BarChart data={rows}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} /><XAxis dataKey="name" stroke="var(--muted)" fontSize={10} interval={0} angle={-30} textAnchor="end" height={70} /><YAxis stroke="var(--muted)" /><Tooltip contentStyle={tip} cursor={{ fill: 'var(--bg-2)' }} /><Bar dataKey="sold" fill="var(--accent)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
        <div className="card fade-up"><div className="section-title">Revenue by category</div>
          <div style={{ height: 300 }}><ResponsiveContainer><PieChart><Pie data={byCat} dataKey="value" nameKey="name" innerRadius={65} outerRadius={110} paddingAngle={3} label={({ name }) => name}>{byCat.map((c) => <Cell key={c.name} fill={c.color} />)}</Pie><Tooltip contentStyle={tip} formatter={(v) => `₹${v.toLocaleString()}`} /></PieChart></ResponsiveContainer></div></div>
      </div>
      <div className="card table-wrap fade-up"><table className="table"><thead><tr><th>Event</th><th>Date</th><th>Sold</th><th>Occupancy</th><th>Revenue</th><th></th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r.e.id}><td><b>{r.e.emoji} {r.e.title}</b></td><td className="small">{fmtDate(r.e.date)}</td><td>{r.sold}/{ev.capacity(r.e)}</td><td style={{ minWidth: 120 }}><div className="progress"><div style={{ width: `${r.fill}%` }} /></div></td><td className="bold">₹{r.revenue.toLocaleString()}</td>
          <td>{r.e.organizer === user.id && <button className="btn ghost icon sm" onClick={() => confirm('Delete event?') && ev.deleteEvent(r.e.id)}><Trash2 size={14} /></button>}</td></tr>)}</tbody></table></div>
    </div>
  )
}
