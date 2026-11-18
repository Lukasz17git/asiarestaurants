import { vilafrancaZone } from './deliveryRules'
import { facts, formatPrice } from '../data/facts'

// WhatsApp shows ~2,50 €~ crossed out; only Vilafranca ships free
const getMessageFeeLine = (quote) => {
    if (!quote.isVilafranca) return `Envío fuera de Vilafranca: ${formatPrice(quote.deliveryFeeInCents)}`
    if (quote.deliveryFeeInCents) return `Envío Vilafranca: ${formatPrice(quote.deliveryFeeInCents)}`
    return `Envío Vilafranca: ~${formatPrice(vilafrancaZone.deliveryFeeInCents)}~ GRATIS`
}

// Always in Spanish, for the restaurant, read on a phone: each title fits in one line.
// No emojis: through wa.me 🛵, ✅ or ☎ arrive as '�'
export const createOrderMessage = ({ cartItems, customer, type, quote, subtotalInCents }) => {
    const isPickup = type === 'pickup'
    const dishLines = cartItems.map(({ dish, quantity }) => `- ${quantity} x ${dish.number}. ${dish.name.es}${dish.pieces > 1 ? ` (${dish.pieces} uds.)` : ''}: ${formatPrice(dish.priceInCents * quantity)}`)
    const notes = customer.notes.trim()

    return [
        isPickup ? '*NUEVO PEDIDO PARA RECOGER*' : '*NUEVO PEDIDO A DOMICILIO*',
        '',
        '*CLIENTE*',
        customer.name.trim(),
        customer.phone.trim(),
        '',
        ...(isPickup ? [] : ['*DIRECCIÓN DEL CLIENTE*', customer.address.trim(), customer.postalCode, '']),
        '*PEDIDO*',
        ...dishLines,
        '',
        ...(isPickup ? [] : [`Subtotal: ${formatPrice(subtotalInCents)}`, getMessageFeeLine(quote)]),
        `*TOTAL: ${formatPrice(quote.totalInCents)}*`,
        '',
        ...(notes ? ['*OBSERVACIONES*', notes, ''] : []),
        `Por favor, confirmad el pedido, la hora de ${isPickup ? 'recogida' : 'entrega'} y cómo pagar. Gracias.`,
    ].join('\n')
}

export const createWhatsappUrl = (message) => `${facts.whatsappUrl}?text=${encodeURIComponent(message)}`
