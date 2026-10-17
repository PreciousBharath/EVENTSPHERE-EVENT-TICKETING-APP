import { createContext, useContext } from 'react'
import { useAuth } from './auth.jsx'
import { usePersistentState, useUserState, uid } from './storage.js'
import { useToast } from './toast.jsx'
import { SEED_EVENTS, preSold } from './data.js'

const Ctx = createContext(null)

export function EventsProvider({ children }) {
  const { user } = useAuth()
  const notify = useToast()
  const [events, setEvents] = usePersistentState('events', SEED_EVENTS)
  const [orders, setOrders] = usePersistentState('orders', [])
  const [saved, setSaved] = useUserState(user, 'saved', user?.id === 'demo' ? ['e2', 'e5'] : [])

  const soldSeats = (eventId) => new Set(orders.filter((o) => o.eventId === eventId && o.status !== 'cancelled').flatMap((o) => o.seats))
  const isSold = (eventId, r, c, label) => preSold(eventId, r, c) || soldSeats(eventId).has(label)
  const capacity = (e) => e.rows * e.cols
  const soldCount = (e) => { let n = 0; for (let r = 0; r < e.rows; r++) for (let c = 0; c < e.cols; c++) if (preSold(e.id, r, c)) n++; return n + soldSeats(e.id).size }

  const checkout = ({ eventId, seats, total, promo, attendee }) => {
    const o = { id: uid().toUpperCase(), eventId, seats, total, promo, attendee, userId: user.id, status: 'confirmed', checkedIn: false, at: Date.now() }
    setOrders([o, ...orders])
    notify(`🎉 ${seats.length} ticket(s) booked!`, 'success')
    return o
  }
  const cancelOrder = (id) => { setOrders(orders.map((o) => (o.id === id ? { ...o, status: 'cancelled' } : o))); notify('Booking cancelled — refund initiated') }
  const checkIn = (id) => {
    const o = orders.find((x) => x.id === id.trim().toUpperCase())
    if (!o) return { ok: false, msg: 'Ticket not found' }
    if (o.status === 'cancelled') return { ok: false, msg: 'Ticket was cancelled' }
    if (o.checkedIn) return { ok: false, msg: `Already checked in at ${new Date(o.checkedIn).toLocaleTimeString()}` }
    setOrders(orders.map((x) => (x.id === o.id ? { ...x, checkedIn: Date.now() } : x)))
    return { ok: true, msg: `Welcome, ${o.attendee.name}! ${o.seats.length} seat(s): ${o.seats.join(', ')}`, o }
  }
  const createEvent = (e) => { const ev = { ...e, id: uid(), organizer: user.id }; setEvents([ev, ...events]); notify('Event published 🚀', 'success'); return ev }
  const deleteEvent = (id) => setEvents(events.filter((e) => e.id !== id))
  const toggleSave = (id) => setSaved(saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id])

  return (
    <Ctx.Provider value={{ events, orders, myOrders: orders.filter((o) => o.userId === user?.id), saved, toggleSave, isSold, capacity, soldCount, checkout, cancelOrder, checkIn, createEvent, deleteEvent }}>
      {children}
    </Ctx.Provider>
  )
}

export const useEvents = () => useContext(Ctx)
