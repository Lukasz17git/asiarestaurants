// Cents, so 15,00 € + 2,50 € is exactly 17,50 €
const vilafrancaPostalCode = '08720'
export const vilafrancaZone = { minimumOrderInCents: 0, deliveryFeeInCents: 250, freeDeliveryFromInCents: 2000 }
// Every other 5-digit postal code
export const outsideVilafrancaZone = { minimumOrderInCents: 4000, deliveryFeeInCents: 500 }

const isValidPostalCode = (postalCode) => /^\d{5}$/.test(postalCode)

// status: 'ok' | 'missingPostalCode' | 'invalidPostalCode' | 'belowMinimum'
export const getDeliveryQuote = ({ type, postalCode, subtotalInCents }) => {
    if (type === 'pickup') return { status: 'ok', deliveryFeeInCents: 0, totalInCents: subtotalInCents }
    if (!postalCode) return { status: 'missingPostalCode' }
    if (!isValidPostalCode(postalCode)) return { status: 'invalidPostalCode' }

    const isVilafranca = postalCode === vilafrancaPostalCode
    const zone = isVilafranca ? vilafrancaZone : outsideVilafrancaZone

    // Exactly 20,00 € already ships free
    const isFree = zone.freeDeliveryFromInCents && subtotalInCents >= zone.freeDeliveryFromInCents
    const deliveryFeeInCents = isFree ? 0 : zone.deliveryFeeInCents
    const totalInCents = subtotalInCents + deliveryFeeInCents

    // The fee and total also come below the minimum, so the customer sees them before reaching it
    const missingForMinimumInCents = zone.minimumOrderInCents - subtotalInCents
    if (missingForMinimumInCents > 0) return { status: 'belowMinimum', isVilafranca, deliveryFeeInCents, totalInCents, minimumOrderInCents: zone.minimumOrderInCents, missingForMinimumInCents }

    const missingForFreeDeliveryInCents = !isFree && zone.freeDeliveryFromInCents ? zone.freeDeliveryFromInCents - subtotalInCents : 0
    return { status: 'ok', isVilafranca, deliveryFeeInCents, totalInCents, missingForFreeDeliveryInCents }
}
