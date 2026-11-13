import { vilafrancaZone } from './deliveryRules'
import { facts, formatPrice, formatShortPrice } from '../data/facts'

// WhatsApp shows ~2,50 €~ crossed out
const getMessageFeeText = (type, quote) => {
    if (quote.deliveryFeeInCents) return formatPrice(quote.deliveryFeeInCents)
    if (type === 'pickup') return formatPrice(0)
    return `~${formatPrice(vilafrancaZone.deliveryFeeInCents)}~ GRATIS (envío gratuito a Vilafranca desde ${formatShortPrice(vilafrancaZone.freeDeliveryFromInCents)})`
}

// Always in Spanish, for the restaurant, in the format they asked for
export const createOrderMessage = ({ cartItems, customer, type, quote, subtotalInCents }) => {
    const deliveryLines = type === 'pickup'
        ? ['Tipo: Recogida en el restaurante']
        : ['Tipo: Entrega a domicilio', `Dirección: ${customer.address.trim()}`, `Código postal: ${customer.postalCode}`]
    const dishLines = cartItems.map(({ dish, quantity }) =>
        `- ${quantity} x ${dish.number}. ${dish.name.es} (${formatPrice(dish.priceInCents)}) = ${formatPrice(dish.priceInCents * quantity)}`)
    const notes = customer.notes.trim()

    return [
        `NUEVO PEDIDO - ${facts.name}`,
        '',
        `Nombre: ${customer.name.trim()}`,
        `Teléfono: ${customer.phone.trim()}`,
        ...deliveryLines,
        '',
        'Pedido:',
        ...dishLines,
        '',
        `Subtotal: ${formatPrice(subtotalInCents)}`,
        `Gastos de envío: ${getMessageFeeText(type, quote)}`,
        `TOTAL: ${formatPrice(quote.totalInCents)}`,
        '',
        ...(notes ? [`Observaciones: ${notes}`, ''] : []),
        'Por favor, confirmad el pedido, el tiempo de entrega y cómo realizar el pago. Gracias.',
    ].join('\n')
}

export const createWhatsappUrl = (message) => `${facts.whatsappUrl}?text=${encodeURIComponent(message)}`
