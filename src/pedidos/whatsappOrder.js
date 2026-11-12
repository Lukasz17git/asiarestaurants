import { facts, formatPrice } from '../data/facts'

const getMessageFeeText = (type, quote) => {
    if (quote.status === 'unknownZone') return 'a consultar'
    if (quote.deliveryFeeInCents) return formatPrice(quote.deliveryFeeInCents)
    return type === 'pickup' ? formatPrice(0) : 'GRATIS'
}

// Always in Spanish, for the restaurant, in the format they asked for
export const createOrderMessage = ({ cartItems, customer, type, quote, subtotalInCents }) => {
    const deliveryLines = type === 'pickup'
        ? ['Tipo: Recogida en el restaurante']
        : ['Tipo: Entrega a domicilio', `Dirección: ${customer.address.trim()}`, `Código postal: ${customer.postalCode}`]
    const dishLines = cartItems.map(({ dish, quantity }) =>
        `- ${quantity} x ${dish.number}. ${dish.name.es} (${formatPrice(dish.priceInCents)}) = ${formatPrice(dish.priceInCents * quantity)}`)
    const totalLine = quote.status === 'unknownZone'
        ? `TOTAL (sin envío): ${formatPrice(subtotalInCents)}`
        : `TOTAL: ${formatPrice(quote.totalInCents)}`
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
        totalLine,
        '',
        ...(notes ? [`Observaciones: ${notes}`, ''] : []),
        'Por favor, confirmad el pedido, el tiempo de entrega y cómo realizar el pago. Gracias.',
    ].join('\n')
}

export const createWhatsappUrl = (message) => `${facts.whatsappUrl}?text=${encodeURIComponent(message)}`
