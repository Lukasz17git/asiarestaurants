// Zones confirmed by the restaurant (#4); cents, so 15,00 € + 1,95 € is exactly 16,95 €
export const deliveryZones = [
    { postalCodes: ['08720'], minimumOrderInCents: 0, deliveryFeeInCents: 195, freeDeliveryFromInCents: 2000 },
    { postalCodes: ['08734'], minimumOrderInCents: 4000, deliveryFeeInCents: 400 },
    { postalCodes: ['08730', '08792', '08794', '08796'], minimumOrderInCents: 4000, deliveryFeeInCents: 500 },
    { postalCodes: ['08799'], minimumOrderInCents: 4500, deliveryFeeInCents: 500 },
]

const isValidPostalCode = (postalCode) => /^\d{5}$/.test(postalCode)

// status: 'ok' | 'missingPostalCode' | 'invalidPostalCode' | 'unknownZone' (fee to ask by WhatsApp) | 'belowMinimum'
export const getDeliveryQuote = ({ type, postalCode, subtotalInCents }) => {
    if (type === 'pickup') return { status: 'ok', deliveryFeeInCents: 0, totalInCents: subtotalInCents }
    if (!postalCode) return { status: 'missingPostalCode' }
    if (!isValidPostalCode(postalCode)) return { status: 'invalidPostalCode' }

    const zone = deliveryZones.find(({ postalCodes }) => postalCodes.includes(postalCode))
    if (!zone) return { status: 'unknownZone', totalInCents: subtotalInCents }

    const missingForMinimumInCents = zone.minimumOrderInCents - subtotalInCents
    if (missingForMinimumInCents > 0) return { status: 'belowMinimum', minimumOrderInCents: zone.minimumOrderInCents, missingForMinimumInCents }

    const isFree = zone.freeDeliveryFromInCents && subtotalInCents >= zone.freeDeliveryFromInCents
    const deliveryFeeInCents = isFree ? 0 : zone.deliveryFeeInCents
    const missingForFreeDeliveryInCents = !isFree && zone.freeDeliveryFromInCents ? zone.freeDeliveryFromInCents - subtotalInCents : 0
    return { status: 'ok', deliveryFeeInCents, totalInCents: subtotalInCents + deliveryFeeInCents, missingForFreeDeliveryInCents }
}
