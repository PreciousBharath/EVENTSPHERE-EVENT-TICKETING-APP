import { Ticket, Compass, CalendarDays, Heart, LayoutDashboard, PlusCircle, ScanLine, Armchair, QrCode, ShieldCheck, PartyPopper } from 'lucide-react'

export const APP = {
  key: 'eventsphere',
  name: 'EventSphere',
  logo: Ticket,
  defaultTheme: 'dark',
  defaultAccent: 0,
  demo: { name: 'Karthik Raja', email: 'demo@eventsphere.app', password: 'Demo@1234' },
  hero: {
    title: 'Discover unforgettable events. Grab the best seats.',
    subtitle: 'Concerts, tech summits, comedy nights and workshops — pick your exact seat on an interactive map, check out in seconds and carry QR tickets everywhere.',
    features: [
      { icon: Armchair, text: 'Interactive seat maps with live availability' },
      { icon: QrCode, text: 'Instant QR e-tickets' },
      { icon: PartyPopper, text: 'Host your own events & track sales' },
      { icon: ShieldCheck, text: 'Secure accounts with hashed passwords' },
    ],
  },
  nav: [
    { to: '/', label: 'Discover', icon: Compass },
    { to: '/calendar', label: 'Calendar', icon: CalendarDays },
    { to: '/tickets', label: 'My Tickets', icon: Ticket },
    { to: '/saved', label: 'Saved', icon: Heart },
    { to: '/organizer', label: 'Organizer', icon: LayoutDashboard },
    { to: '/create', label: 'Create Event', icon: PlusCircle },
    { to: '/checkin', label: 'Check-in', icon: ScanLine },
  ],
  notifications: ['Use promo code EARLY10 for 10% off', 'Selling fast: seats are going quickly for this weekend’s headline shows', 'Host an event and watch sales in real time'],
}
