import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { Protected, GuestOnly } from './guard.jsx'
import { EventsProvider } from './events.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Discover from './pages/Discover.jsx'
import Calendar from './pages/Calendar.jsx'
import Tickets from './pages/Tickets.jsx'
import Organizer from './pages/Organizer.jsx'
import Create from './pages/Create.jsx'
import Checkin from './pages/Checkin.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
      <Route element={<Protected><EventsProvider><Layout /></EventsProvider></Protected>}>
        <Route path="/" element={<Discover />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/saved" element={<Discover savedOnly />} />
        <Route path="/organizer" element={<Organizer />} />
        <Route path="/create" element={<Create />} />
        <Route path="/checkin" element={<Checkin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
