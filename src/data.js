export const CATEGORIES = [
  { id: 'Music', icon: '🎸', color: '#ec4899' }, { id: 'Tech', icon: '💻', color: '#6366f1' }, { id: 'Comedy', icon: '🎤', color: '#f59e0b' },
  { id: 'Sports', icon: '🏏', color: '#10b981' }, { id: 'Workshop', icon: '🛠️', color: '#06b6d4' }, { id: 'Food', icon: '🍜', color: '#ef4444' }, { id: 'Art', icon: '🎨', color: '#a855f7' },
]
const RAW = [
  ['Neon Nights Live', 'Music', 'Madurai Arena', 'Madurai', 999], ['AI Builders Summit 2026', 'Tech', 'TechPark Convention Hall', 'Bengaluru', 1499],
  ['Stand-up Saturday', 'Comedy', 'The Laugh Factory', 'Chennai', 499], ['Monsoon Cricket Cup Final', 'Sports', 'City Sports Ground', 'Coimbatore', 349],
  ['React Masterclass', 'Workshop', 'Pantech Learning Hub', 'Madurai', 799], ['Street Food Carnival', 'Food', 'Marina Grounds', 'Chennai', 199],
  ['Canvas & Coffee', 'Art', 'Gallery Twelve', 'Bengaluru', 599], ['Indie Acoustic Sessions', 'Music', 'Blue Note Lounge', 'Hyderabad', 699],
  ['Cloud Native Day', 'Tech', 'Hitex Exhibition Centre', 'Hyderabad', 999], ['Improv Night', 'Comedy', 'Black Box Theatre', 'Bengaluru', 399],
  ['Marathon for Good', 'Sports', 'Race Course Road', 'Coimbatore', 299], ['GenAI Prompt Lab', 'Workshop', 'Innovation Studio', 'Chennai', 1199],
  ['Biryani Fest', 'Food', 'Palace Grounds', 'Hyderabad', 249], ['Symphony Under Stars', 'Music', 'Open Air Amphitheatre', 'Chennai', 1299],
  ['Cyber Security Bootcamp', 'Workshop', 'SecureLabs Auditorium', 'Bengaluru', 1499], ['Photo Walk: Heritage Madurai', 'Art', 'Meenakshi Temple Gate', 'Madurai', 149],
  ['Startup Pitch Night', 'Tech', 'Founders Hub', 'Chennai', 299], ['Kabaddi Pro Showdown', 'Sports', 'Indoor Stadium', 'Madurai', 449],
]
const EMOJI = { Music: '🎶', Tech: '🤖', Comedy: '😂', Sports: '🏆', Workshop: '🧠', Food: '🍛', Art: '🖼️' }

export const SEED_EVENTS = RAW.map(([title, category, venue, city, price], i) => {
  const d = new Date(); d.setDate(d.getDate() + 2 + i * 3); d.setHours([18, 10, 20, 15, 9, 17][i % 6], 0, 0, 0)
  const cat = CATEGORIES.find((c) => c.id === category)
  return {
    id: `e${i + 1}`, title, category, venue, city, price, date: d.toISOString(), color: cat.color, emoji: EMOJI[category],
    duration: [3, 8, 2, 5, 6, 4, 3][i % 7], rows: 8, cols: 14, organizer: 'seed', featured: i % 4 === 0,
    description: `${title} brings together the best of ${category.toLowerCase()} in ${city}. Expect an electric atmosphere, great company and memories that last long after the final moment.`,
    agenda: [['Doors open', 0], ['Main programme', 1], ['Interval & networking', 2], ['Grand finale', 3]].slice(0, 3 + (i % 2)),
    hosts: ['Ananya', 'Vikram', 'Zoya', 'Rohan', 'Meera'].slice(i % 3, (i % 3) + 2),
  }
})

export const TIERS = [
  { id: 'VIP', rows: [0, 1], mult: 2.5, color: '#f59e0b' },
  { id: 'Premium', rows: [2, 3, 4], mult: 1.5, color: '#a855f7' },
  { id: 'General', rows: [5, 6, 7], mult: 1, color: '#06b6d4' },
]
export const tierOf = (row) => TIERS.find((t) => t.rows.includes(row)) || TIERS[2]
export const seatLabel = (r, c) => `${String.fromCharCode(65 + r)}${c + 1}`

/** Deterministic pre-sold seats so each event's map looks realistically busy. */
export const preSold = (eventId, r, c) => {
  const h = [...`${eventId}-${r}-${c}`].reduce((a, ch) => (a * 33 + ch.charCodeAt(0)) >>> 0, 5381)
  return h % 100 < 22 + (r < 2 ? 18 : 0)
}

export const PROMOS = { EARLY10: 0.1, STUDENT20: 0.2 }
export const fmtDate = (iso) => new Date(iso).toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
