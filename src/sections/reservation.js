import { facts } from '../data/facts'
import { createWhatsappUrl } from '../pedidos/whatsappOrder'

const toMinutes = (timeText) => {
    const [hour, minute] = timeText.split(':').map(Number)
    return hour * 60 + minute
}

const toTimeText = (minutes) => [Math.floor(minutes / 60), minutes % 60].map((part) => String(part).padStart(2, '0')).join(':')

// ('13:00', '15:30') -> ['13:00', '13:30', '14:00', '14:30', '15:00']: every half hour until 30 minutes before closing
const getTimeSlots = (opens, closes) => {
    const [opening, closing] = [opens, closes].map(toMinutes)
    return Array.from({ length: (closing - opening) / 30 }, (_, index) => toTimeText(opening + index * 30))
}

// '2026-11-07' in local time (toISOString would give the UTC day, one day off after midnight in Spain)
export const toDateValue = (date) => [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((part) => String(part).padStart(2, '0')).join('-')

const toDate = (dateValue) => {
    const [year, month, day] = dateValue.split('-').map(Number)
    return new Date(year, month - 1, day)
}

// 'Monday', as restaurant.json names the days
const englishWeekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' })

// That weekday's shifts as restaurant.json has them ({ key, name, time, opens, closes }); [] when closed
export const getWeekdayShifts = (date) => facts.weekShifts[englishWeekday.format(date)]

// '2026-11-09' -> that weekday's [{ name: 'Mediodía', time: '13:00 – 15:30', slots: ['13:00', ...] }, ...]; [] when closed
export const getShiftsOn = (dateValue) => getWeekdayShifts(toDate(dateValue))
    .map(({ name, time, opens, closes }) => ({ name, time, slots: getTimeSlots(opens, closes) }))

// Today's slots that already started can't be booked
export const isPastSlot = (dateValue, slot) => {
    const now = new Date()
    return dateValue === toDateValue(now) && toMinutes(slot) <= now.getHours() * 60 + now.getMinutes()
}

// A slot the restaurant opens for on that day and that hasn't started yet
export const isBookableSlot = (dateValue, slot) => getShiftsOn(dateValue).some(({ slots }) => slots.includes(slot)) && !isPastSlot(dateValue, slot)

// Today and the next days, from the visitor's clock: always current without a rebuild
export const getNextDays = (count) => Array.from({ length: count }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() + index)
    return date
})

const longDate = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

// '2026-11-07' -> 'Sábado 7 de noviembre'
const formatLongDate = (dateValue) => {
    const text = longDate.format(toDate(dateValue)).replace(',', '')
    return text[0].toUpperCase() + text.slice(1)
}

// Always in Spanish, for the restaurant; people is '1' to '6' or 'Más de 6'
// No emojis: through wa.me they arrive as '�'. WhatsApp shows *text* in bold
export const createReservationUrl = ({ people, date, time, name, phone: customerPhone }) => {
    const message = [
        `Hola, me gustaría reservar una mesa en ${facts.name}:`,
        '',
        `*Personas:* ${people}`,
        `*Día:* ${formatLongDate(date)}`,
        `*Hora:* ${time}`,
        `*Nombre:* ${name.trim()}`,
        `*Teléfono:* ${customerPhone.trim()}`,
        '',
        '¿Nos confirmáis la mesa? ¡Gracias!',
    ].join('\n')
    return createWhatsappUrl(message)
}
